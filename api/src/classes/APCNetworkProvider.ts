import { IActivity, IAddress, IItem, IMarketData, IOffer, IPenguin } from "@apcolony/marketplace-api";
import { Attributes } from "@apcolony/marketplace-api/out/classes";
import { ApiNetworkProvider, NonFungibleTokenOfAccountOnNetwork, ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";
import { Nonce } from "@elrondnetwork/erdjs-network-providers/out/primitives";
import { AbiRegistry, Address, AddressValue, ArgSerializer, BytesValue, ContractFunction, ResultsParser, SmartContract, SmartContractAbi, StringValue, U64Value } from "@elrondnetwork/erdjs/out";
import { promises } from "fs";
import { customisationContract, penguinsCollection, gateway, marketplaceContract, itemsCollection, getPenguinWebThumbnail, nftStakingContract, nftStakingToken, originalTokensAmountInStakingSc } from "../const";
import { isCollectionAnItem } from "../utils/dbHelper";
import { extractCIDFromIPFS, getIdFromPenguinName, getNameFromPenguinId, parseAttributes, splitCollectionAndNonce } from "../utils/string";
import APCNft from "./APCNft";
import { BigNumber } from "bignumber.js";
import { parseActivity, parseMarketData, parseMultiValueIdAuction, parseStakedPenguins } from "./ABIParser";
import { toIdentifier } from "../utils/conversion";
import ItemsDatabase from "@apcolony/db-marketplace/out/ItemsDatabase";
import RequestsMonitor from "./RequestsMonitor";

/**
 * We create this function because a lot of methods of ProxyNetworkProvider are not implemented yet.
 */
export class APCNetworkProvider {

    private readonly apiProvider: ApiNetworkProvider;
    private readonly proxyProvider: ProxyNetworkProvider;
    private readonly itemsDatabase: ItemsDatabase;

    private readonly apiRequestsMonitor: RequestsMonitor = new RequestsMonitor();
    private readonly gatewayRequestMonitor: RequestsMonitor = new RequestsMonitor();

    get lastMinuteRequests() {
        return {
            api: this.apiRequestsMonitor.lastMinuteRequests,
            gateway: this.gatewayRequestMonitor.lastMinuteRequests
        };
    }

    constructor(gatewayUrl: string, apiUrl: string, itemsDatabase: ItemsDatabase) {
        this.proxyProvider = new ProxyNetworkProvider(gatewayUrl, {
            timeout: 15_000
        });
        this.apiProvider = new ApiNetworkProvider(apiUrl, {
            timeout: 15_000
        })
        this.itemsDatabase = itemsDatabase;
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
        this.apiRequestsMonitor.increment();

        const nfts = Array.from(res)
            .map((raw: any) => APCNft.fromApiHttpResponse(raw));

        return nfts;
    }

    public async getNft(collection: string, nonce: number): Promise<APCNft> {
        let nonceAsHex = new Nonce(nonce).hex();
        let response = await this.apiProvider.doGetGeneric(`nfts/${collection}-${nonceAsHex}`);
        this.apiRequestsMonitor.increment();
        let token = APCNft.fromApiHttpResponse(response);

        return token;
    }

    public async getNftsOfAccount(address: IAddress, collections: string[]): Promise<APCNft[]> {

        // set size as lower improve perf, so 1_000 (250 items, 750 penguins) is okay
        const size = 1_000;
        // we are using the api, while we would use the gateway, because the API handle when the account is empty (and so not founded by the gateway)
        const response = await this.apiProvider.doGetGeneric(`accounts/${address.bech32()}/nfts?size=${size}?collections=${collections.join(",")}`);
        this.apiRequestsMonitor.increment();

        return response
            .map((item: any) => APCNft.fromApiHttpResponse({ owner: address.bech32(), ...item }));
    }

    public async getPenguinsOfAccount(address: IAddress): Promise<IPenguin[]> {
        const accountsNfts = await this.getNftsOfAccount(address, [penguinsCollection]);

        const penguinsPromises = accountsNfts
            .filter(nft => !!nft.owner)
            .map((nft) => this.getPenguinFromNft(nft));

        const penguinsNfts = (await Promise.all(penguinsPromises))
            .sort((a, b) => a.nonce - b.nonce);

        return penguinsNfts;

    }

    public async getItemsOfAccount(address: IAddress): Promise<IItem[]> {
        const itemsCollections = Object.values(itemsCollection).flat();
        const accountsNfts = await this.getNftsOfAccount(address, itemsCollections);

        const items = accountsNfts
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
        this.gatewayRequestMonitor.increment();
        const endpointDefinition = contract.getEndpoint(contractViewName);

        const { firstValue } = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);

        const activities = (firstValue as any).backingCollection.items
            .map((o: any) => parseActivity(o));

        return activities;
    }

    public async getUriOf(attributes: Attributes, name: string): Promise<string | undefined> {

        const res = await this.proxyProvider.queryContract({
            address: customisationContract,
            func: "getUriOf",
            getEncodedArguments() {
                return new ArgSerializer().valuesToStrings([
                    BytesValue.fromUTF8(attributes.toEndpointArgument()),
                    BytesValue.fromUTF8(name)
                ]);
            },
        });
        this.gatewayRequestMonitor.increment();

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
        this.gatewayRequestMonitor.increment();

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
        this.gatewayRequestMonitor.increment();
        const endpointDefinition = contract.getEndpoint(contractViewName);
        const { firstValue } = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);


        const reponseOffers = (firstValue as any).items;

        const offers = reponseOffers
            .map((o: any) => parseMultiValueIdAuction(o));

        return offers;
    }

    public async getOffersOfAccount(account: string): Promise<IOffer[]> {
        const allCollections = [...Object.values(itemsCollection).flat(), penguinsCollection];

        const offers = await this.getOffers(allCollections);

        return offers.filter(o => o.seller == account);
    }

    public async getPenguinsFromOffers(offers: IOffer[]): Promise<IPenguin[]> {

        if (offers.find(o => o.collection != penguinsCollection)) {
            throw new Error("getPenguinsFromOffers contains items");
        }

        const penguinsPromises = offers
            .map(o => this.getNft(o.collection, o.nonce));
        const nfts = await Promise.all(penguinsPromises);

        return nfts
            .filter(nft => !!nft.owner)
            .map(nft => this.getPenguinFromNft(nft));
    }

    public getItemsFromOffers(offers: IOffer[]): IItem[] {

        if (offers.find(o => o.collection == penguinsCollection)) {
            throw new Error("getItemsFromOffers contains penguins");
        }

        const tokens = offers
            .map(offer => this.itemsDatabase.getItemFromToken(offer.collection, offer.nonce));

        const uniqueIds = [...new Set(tokens.map(token => token.id))];
        const uniqueTokens = uniqueIds
            .map(id => this.itemsDatabase.getTokenFromItemID(id));

        const items = uniqueTokens
            .map(({ collection, nonce }) => this.itemsDatabase.getItemFromToken(collection, nonce));

        return items;
    }

    public async getMarketData(collections: string[]): Promise<IMarketData> {


        const contract = await this.getMarketplaceSmartContract();

        const contractViewName = "getMarketData";
        const query = contract.createQuery({
            func: new ContractFunction(contractViewName),
            args: collections.map(c => BytesValue.fromUTF8(c)),
        });

        const queryResponse = await this.proxyProvider.queryContract(query);
        this.gatewayRequestMonitor.increment();
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

    private async getStakingSmartContract() {
        let jsonContent: string = await promises.readFile("src/abi/nft-staking.abi.json", { encoding: "utf8" });
        let json = JSON.parse(jsonContent);
        let abiRegistry = AbiRegistry.create(json);
        let abi = new SmartContractAbi(abiRegistry, ["nftStaking"]);

        let contract = new SmartContract({ address: nftStakingContract, abi: abi });
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

            thumbnailUrls: {
                ipfs: nft.assets[0],
                high: getPenguinWebThumbnail(extractCIDFromIPFS(nft.assets[0])),
                small: getPenguinWebThumbnail(extractCIDFromIPFS(nft.assets[0])),
            },
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
                return this.itemsDatabase.getTokenFromItemID(id);

            default:
                throw new Error("Invalid type");
        }
    }

    public async getNftsForStaker(address: string, proxyNetwork: APCNetworkProvider) {

        const contract = await this.getStakingSmartContract();

        const contractViewName = "getNftsForStaker";
        const query = contract.createQuery({
            func: new ContractFunction(contractViewName),
            args: [new AddressValue(new Address(address))],
        });

        const queryResponse = await this.proxyProvider.queryContract(query);
        this.gatewayRequestMonitor.increment();
        const endpointDefinition = contract.getEndpoint(contractViewName);
        const { firstValue, returnCode }: any = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition); //TODO: Add type

        const nftsStaked = await parseStakedPenguins(firstValue, proxyNetwork);

        return returnCode == 'ok' ? nftsStaked : 'Unable to fetch data';

    }

    public async getNftsNumberAndRewardsAvailableForStaker(address: string) {

        const contract = await this.getStakingSmartContract();

        const contractViewName = "getNftsNumberAndRewardsAvailableForStaker";
        const query = contract.createQuery({
            func: new ContractFunction(contractViewName),
            args: [new AddressValue(new Address(address))],
        });

        const queryResponse = await this.proxyProvider.queryContract(query);
        this.gatewayRequestMonitor.increment();
        const endpointDefinition = contract.getEndpoint(contractViewName);
        const { secondValue, returnCode }: any = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition); //TODO: Add type        

        return returnCode == 'ok' ? secondValue : 'Unable to fetch data';
    }

    public async getTokensGeneratedByTheSc() {

        const res = await this.apiProvider.doGetGeneric(`accounts/${nftStakingContract}/tokens?${nftStakingToken}`);

        return originalTokensAmountInStakingSc - res[0].balance
    }

}