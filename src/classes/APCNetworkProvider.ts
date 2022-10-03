import { IActivity, IAddress, IItem, IMarketData, IOffer, IPenguin } from "@apcolony/marketplace-api";
import { Attributes } from "@apcolony/marketplace-api/out/classes";
import { ApiNetworkProvider, NonFungibleTokenOfAccountOnNetwork, ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";
import { Nonce } from "@elrondnetwork/erdjs-network-providers/out/primitives";
import { AbiRegistry, Address, ArgSerializer, BytesValue, ContractFunction, ResultsParser, SmartContract, SmartContractAbi, U64Value } from "@elrondnetwork/erdjs/out";
import { promises } from "fs";
import { customisationContract, penguinsCollection, gateway, marketplaceContract } from "../const";
import { getItemFromName, getTokenFromItemID } from "../utils/dbHelper";
import { extractCIDFromIPFS, getIdFromPenguinName, parseAttributes, splitCollectionAndNonce } from "../utils/string";
import APCNft from "./APCNft";
import { BigNumber } from "bignumber.js";
import { parseActivity, parseMultiValueIdAuction } from "./ABIParser";

/**
 * We create this function because a lot of methods of ProxyNetworkProvider are not implemented yet.
 */
export class APCNetworkProvider {

    private readonly apiProvider: ApiNetworkProvider;
    private readonly proxyProvider: ProxyNetworkProvider;

    constructor(gatewayUrl: string, apiUrl: string) {
        this.proxyProvider = new ProxyNetworkProvider(gatewayUrl, {
            timeout: 15_000
        });
        this.apiProvider = new ApiNetworkProvider(apiUrl)
    }

    /**
     * Fixed method of getNonFungibleTokenOfAccount; This one fill properly the "assets" property.
     */
    public async fixed_getNonFungibleTokenOfAccount(address: IAddress, collection: string, nonce: number) {
        const url = `address/${address.bech32()}/nft/${collection}/nonce/${nonce.valueOf()}`;
        const response = await this.proxyProvider.doGetGeneric(url);

        const tokenData = NonFungibleTokenOfAccountOnNetwork.fromProxyHttpResponseByNonce(response.tokenData);
        tokenData.assets = (Array.from(response.tokenData.uris ?? []) as string[])
            .map(b64 => Buffer.from(b64, "base64").toString());

        return tokenData;
    }

    public async getPenguinFromId(id: string): Promise<IPenguin | undefined> {
        const nfts = await this.getNfts(penguinsCollection);

        const nft = nfts.find(nft => getIdFromPenguinName(nft.name).toString() == id);

        if (nft == undefined) return undefined;

        return this.getPenguinFromNft(await this.getNft(nft.collection, nft.nonce));
    }

    /**
     * The API doesn't return owner
     */
    public async getNfts(collection: string): Promise<APCNft[]> {
        const res = await this.apiProvider.doGetGeneric(`collections/${collection}/nfts`);

        const nfts = Array.from(res)
            .map((raw: any) => APCNft.fromApiHttpResponse(raw));

        return nfts;
    }

    public async getNft(collection: string, nonce: number): Promise<NonFungibleTokenOfAccountOnNetwork> {
        let nonceAsHex = new Nonce(nonce).hex();
        let response = await this.apiProvider.doGetGeneric(`nfts/${collection}-${nonceAsHex}`);
        let token = APCNft.fromApiHttpResponse(response);

        return token;
    }

    public async getNftsOfAccount(address: IAddress): Promise<APCNft[]> {

        const response = await this.proxyProvider.doGetGeneric(`address/${address.bech32()}/esdt`);

        const tokens = Object.values(response.esdts)
            .filter((item: any) => item.nonce >= 0) // we keep only NFTs        
            .map((item: any) => {
                let nft = APCNft.fromProxyHttpResponse(item)
                nft.owner = address.bech32();

                return nft;
            });

        return tokens;
    }

    public async getActivities(collection: string, nonce: number): Promise<IActivity[]> {

        const contract = await this.getMarketplaceSmartContract();

        const contractViewName = "getBoughtAuctionsOfToken";
        const query = contract.createQuery({
            func: new ContractFunction(contractViewName),
            args: [BytesValue.fromUTF8(collection), new U64Value(nonce)],
        });

        const queryResponse = await this.proxyProvider.queryContract(query);
        const endpointDefinition = contract.getEndpoint(contractViewName);

        const { firstValue } = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);

        const activities = (firstValue as any).backingCollection.items
            .map((o: any) => parseActivity(o));

        return activities;
    }

    public async getCidOf(attributes: Attributes): Promise<string | undefined> {

        const res = await this.proxyProvider.queryContract({
            address: customisationContract,
            func: "getCidOf",
            getEncodedArguments() {
                return new ArgSerializer().valuesToStrings([
                    BytesValue.fromUTF8(attributes.toEndpointArgument())
                ]);
            },
        });

        return Buffer.from(res.returnData[0], "base64").toString();
    }

    public async getAttributesToRender(): Promise<Attributes[]> {
        const res = await this.proxyProvider.queryContract({
            address: customisationContract,
            func: "getImagesToRender",
            getEncodedArguments() {
                return []
            }
        });

        return res.returnData
            .map((b64: string) => Attributes.fromEndpointArgument(Buffer.from(b64, "base64").toString()));
    }

    public async getOffers(collection: string): Promise<IOffer[]> {

        const contract = await this.getMarketplaceSmartContract();

        const contractViewName = "getAuctionsOfCollection";
        const query = contract.createQuery({
            func: new ContractFunction(contractViewName),
            args: [BytesValue.fromUTF8(collection)],
        });

        const queryResponse = await this.proxyProvider.queryContract(query);
        const endpointDefinition = contract.getEndpoint(contractViewName);
        const { firstValue } = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);


        const reponseOffers = (firstValue as any).items;

        const offers = reponseOffers
            .map((o: any) => parseMultiValueIdAuction(o));

        return offers;
    }

    public async getMarketData(collection: string): Promise<IMarketData> {

        const offers = await this.getOffers(collection);
        const lowestOffer = offers.reduce((prev, curr) => prev.price < curr.price ? prev : curr, offers[0]);
        const totalPrice = offers.reduce((prev, curr) => prev.plus(curr.price), new BigNumber(0));
        const averagePrice = totalPrice.div(offers.length);

        return {
            floorPrice: lowestOffer?.price ?? "0",
            averagePrice: offers.length > 0 ? averagePrice.toString() : "0",
            totalListed: offers.length,
            totalVolume: "-1",
        }
    }

    private async getMarketplaceSmartContract() {
        let jsonContent: string = await promises.readFile("src/abi/esdt-nft-marketplace.abi.json", { encoding: "utf8" });
        let json = JSON.parse(jsonContent);
        let abiRegistry = AbiRegistry.create(json);
        let abi = new SmartContractAbi(abiRegistry, ["EsdtNftMarketplace"]);

        let contract = new SmartContract({ address: marketplaceContract, abi: abi });
        return contract;
    }

    private async getPenguinFromNft(nft: APCNft): Promise<IPenguin> {

        if (nft.assets[0] == undefined) throw new Error(`No CID linked to the nft ${nft.identifier}`);
        if (!nft.owner) throw new Error("Missing owner on NFT");

        return {
            id: getIdFromPenguinName(nft.name).toString(),
            identifier: nft.identifier,
            name: nft.name,
            nonce: nft.nonce,
            score: -1,
            purchaseDate: new Date(), // TODO:
            thumbnailCID: extractCIDFromIPFS(nft.assets[0]),
            equippedItems: await this.getEquippedItemsFromAttributes(nft.attributes.toString()),
            owner: nft.owner
        }
    }

    private async getEquippedItemsFromAttributes(rawAttributes: string): Promise<{ [key: string]: IItem }> {

        const attributes = parseAttributes(rawAttributes);
        const equippedItems = {} as { [key: string]: IItem };

        for (const { slot, itemName } of attributes) {
            if (itemName == "unequipped") continue;

            equippedItems[slot] = await this.getItem(getItemFromName(itemName, slot));
        }

        return equippedItems;
    }

    // TODO: there is two calls in this function, we should optimize it
    public async getItem(item: { identifier: string, name: string, slot: string, id: string }, owner?: Address): Promise<IItem> {

        const { collection: ticker, nonce } = splitCollectionAndNonce(item.identifier);

        const nft = await this.fixed_getNonFungibleTokenOfAccount(customisationContract, ticker, nonce);

        if (!nft.assets[0]) throw new Error(`No thumbnail CID linked to the item ${item.name}(${item.identifier})`);
        if (!nft.assets[1]) throw new Error(`No render CID linked to the item ${item.name}(${item.identifier})`);

        let amount;

        if (owner) {
            const nftOnOwner = await this.fixed_getNonFungibleTokenOfAccount(owner, ticker, nonce);
            amount = nftOnOwner.supply.toNumber();
        }

        return {
            id: item.id,
            identifier: item.identifier,
            name: item.name,
            slot: item.slot,
            nonce: nonce,
            thumbnailCID: extractCIDFromIPFS(nft.assets[0]),
            renderCID: extractCIDFromIPFS(nft.assets[1]),
            description: "", //TODO:
            amount: amount
        }

    }

    public async getToken(type: "penguins" | "items", id: string) {
        switch (type) {
            case "penguins":
                const penguin = await this.getPenguinFromId(id)

                if (!penguin) throw new Error(`Penguin with id ${id} not found`);

                return {
                    collection: penguinsCollection,
                    nonce: penguin.nonce
                };

            case "items":
                return getTokenFromItemID(id);

            default:
                throw new Error("Invalid type");
        }
    }
}