import { IActivity, IAddress, IItem, IMarketData, IOffer, IPenguin } from "@apcolony/marketplace-api";
import { Attributes } from "@apcolony/marketplace-api/out/classes";
import { ApiNetworkProvider, NonFungibleTokenOfAccountOnNetwork, ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";
import { Nonce } from "@elrondnetwork/erdjs-network-providers/out/primitives";
import { AbiRegistry, Address, ArgSerializer, BytesValue, ContractFunction, ResultsParser, SmartContract, SmartContractAbi, StringValue, U64Value } from "@elrondnetwork/erdjs/out";
import { promises } from "fs";
import { customisationContract, penguinsCollection, gateway, marketplaceContract, itemsCollection, items, getPenguinWebThumbnail } from "../const";
import { getItemFromAttributeName, getTokenFromItemID, isCollectionAnItem } from "../utils/dbHelper";
import { extractCIDFromIPFS, getIdFromPenguinName, getNameFromPenguinId, parseAttributes, splitCollectionAndNonce } from "../utils/string";
import APCNft from "./APCNft";
import { BigNumber } from "bignumber.js";
import { parseActivity, parseMarketData, parseMultiValueIdAuction } from "./ABIParser";
import { toIdentifier } from "../utils/conversion";
import ItemsDatabase from "./ItemsDatabase";

/**
 * We create this function because a lot of methods of ProxyNetworkProvider are not implemented yet.
 */
export class APCNetworkProvider {

    private readonly apiProvider: ApiNetworkProvider;
    private readonly proxyProvider: ProxyNetworkProvider;
    private readonly itemsDatabase: ItemsDatabase;

    constructor(gatewayUrl: string, apiUrl: string, itemsDatabase: ItemsDatabase) {
        this.proxyProvider = new ProxyNetworkProvider(gatewayUrl, {
            timeout: 15_000
        });
        this.apiProvider = new ApiNetworkProvider(apiUrl, {
            timeout: 15_000
        })
        this.itemsDatabase = itemsDatabase;
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

    public async getPenguinFromId(id: string): Promise<IPenguin> {
        const nfts = await this.getNfts(penguinsCollection, {
            name: id,
            withOwner: true
        });

        if (nfts.length == 0) throw new Error(`Penguin ${id} not found`);
        if (nfts.length > 1) throw new Error(`Found ${nfts.length} penguins with the name ${getNameFromPenguinId(id)}.`);

        return this.getPenguinFromNft(nfts[0]);
    }

    /**
     * The API doesn't return owner
     */
    public async getNfts(collection: string, args: { name?: string, withOwner?: boolean, size?: number } = {}): Promise<APCNft[]> {

        const p = new URLSearchParams();
        if (args.name) p.append("name", args.name);
        if (args.withOwner) p.append("withOwner", "true");
        if (args.size) p.append("size", args.size.toString());

        const res = await this.apiProvider.doGetGeneric(`collections/${collection}/nfts?${p.toString()}`);

        const nfts = Array.from(res)
            .map((raw: any) => APCNft.fromApiHttpResponse(raw));

        return nfts;
    }

    public async getNft(collection: string, nonce: number): Promise<APCNft> {
        let nonceAsHex = new Nonce(nonce).hex();
        let response = await this.apiProvider.doGetGeneric(`nfts/${collection}-${nonceAsHex}`);
        let token = APCNft.fromApiHttpResponse(response);

        return token;
    }

    public async getNftsOfAccount(address: IAddress): Promise<APCNft[]> {

        // we are using the api, while we would use the gateway, because the API handle when the account is empty (and so not founded by the gateway)
        const response = await this.apiProvider.doGetGeneric(`accounts/${address.bech32()}/nfts?size=10000`);

        return response
            .map((item: any) => APCNft.fromApiHttpResponse({ owner: address.bech32(), ...item }));
    }

    public async getItemsOfAccount(address: IAddress): Promise<IItem[]> {
        const accountsNfts = await this.getNftsOfAccount(address);

        const items = accountsNfts
            .filter(nft => isCollectionAnItem(nft.collection))
            .map(nft => this.itemsDatabase.getItemFromToken(nft.collection, nft.nonce));

        return items;
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

    public async getUriOf(attributes: Attributes): Promise<string | undefined> {

        const res = await this.proxyProvider.queryContract({
            address: customisationContract,
            func: "getUriOf",
            getEncodedArguments() {
                return new ArgSerializer().valuesToStrings([
                    BytesValue.fromUTF8(attributes.toEndpointArgument())
                ]);
            },
        });

        if (res.returnCode == "user error") {
            return undefined;
        }
        else {
            return Buffer.from(res.returnData[0], "base64").toString();
        }
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

    public async getOffers(collections: string[]): Promise<IOffer[]> {

        const contract = await this.getMarketplaceSmartContract();

        const contractViewName = "getAuctionsOfCollection";
        const query = contract.createQuery({
            func: new ContractFunction(contractViewName),
            args: collections.map(c => BytesValue.fromUTF8(c)),
        });

        const queryResponse = await this.proxyProvider.queryContract(query);
        const endpointDefinition = contract.getEndpoint(contractViewName);
        const { firstValue } = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);


        const reponseOffers = (firstValue as any).items;

        const offers = reponseOffers
            .map((o: any) => parseMultiValueIdAuction(o));

        return offers;
    }

    public async getMarketData(collections: string[]): Promise<IMarketData> {


        const contract = await this.getMarketplaceSmartContract();

        const contractViewName = "getMarketData";
        const query = contract.createQuery({
            func: new ContractFunction(contractViewName),
            args: collections.map(c => BytesValue.fromUTF8(c)),
        });

        const queryResponse = await this.proxyProvider.queryContract(query);
        const endpointDefinition = contract.getEndpoint(contractViewName);
        const { firstValue } = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);

        return parseMarketData(firstValue);
    }


    private async getMarketplaceSmartContract() {
        let jsonContent: string = await promises.readFile("src/abi/esdt-nft-marketplace.abi.json", { encoding: "utf8" });
        let json = JSON.parse(jsonContent);
        let abiRegistry = AbiRegistry.create(json);
        let abi = new SmartContractAbi(abiRegistry, ["EsdtNftMarketplace"]);

        let contract = new SmartContract({ address: marketplaceContract, abi: abi });
        return contract;
    }

    public getPenguinFromNft(nft: APCNft): IPenguin {

        if (nft.assets[0] == undefined) throw new Error(`No CID linked to the nft ${nft.identifier}`);
        if (!nft.owner) throw new Error("Missing owner on NFT");



        return {
            id: getIdFromPenguinName(nft.name).toString(),
            type: "penguins",
            name: nft.name,

            identifier: toIdentifier(nft.collection, nft.nonce),
            collection: nft.collection,
            nonce: nft.nonce,

            thumbnailWebUri: getPenguinWebThumbnail(extractCIDFromIPFS(nft.assets[0])),
            equippedItems: this.getEquippedItemsFromAttributes(nft.attributes.toString()),
            owner: nft.owner
        }
    }

    private getEquippedItemsFromAttributes(rawAttributes: string): { [key: string]: IItem } {

        const attributes = parseAttributes(rawAttributes);
        const equippedItems = {} as { [key: string]: IItem };

        for (const { slot, itemName } of attributes) {
            if (itemName == "unequipped") continue;

            equippedItems[slot] = this.itemsDatabase.getItemFromNameAndSlot(itemName, slot);
        }

        return equippedItems;
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