import { EggTier, ElementType, IActivity, IAddress, IEgg, IItem, IMarketData, INewSaleData, IOffer, IOwnedItem, IPenguin, IToken } from "@apcolony/marketplace-api";
import { Attributes } from "@apcolony/marketplace-api/out/classes";
import { ApiNetworkProvider, ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";
import { Nonce } from "@elrondnetwork/erdjs-network-providers/out/primitives";
import { AbiRegistry, Address, AddressValue, ArgSerializer, BytesValue, ContractFunction, ResultsParser, SmartContract, SmartContractAbi, U64Value } from "@elrondnetwork/erdjs/out";
import { promises } from "fs";
import { customisationContract, penguinsCollection, marketplaceContract, itemsCollection, getPenguinWebThumbnail, nftStakingContract, nftStakingToken, originalTokensAmountInStakingSc, allCollections, eggsCollection, newSalesContract } from "../const";
import { getRandomsPenguinsIds, isCollectionAnItem } from "../utils/dbHelper";
import { extractCIDFromIPFS, getIdFromPenguinName, getNameFromPenguinId, parseAttributes } from "../utils/string";
import APCNft from "./APCNft";
import { parseActivity, parseMarketData, parseMultiValueIdAuction, parseNewSaleData, parseStakedPenguins } from "./ABIParser";
import { toIdentifier } from "../utils/conversion";
import ItemsDatabase from "@apcolony/db-marketplace/out/ItemsDatabase";
import RequestsMonitor from "./RequestsMonitor";
import { ErrNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out/errors";
import { Cache, CacheClass } from "memory-cache";
import { EggsDatabase } from "@apcolony/db-marketplace/out/EggsDatabase";
import { IOwnedEgg } from "@apcolony/marketplace-api";
import { sortByScore } from "../utils/sortByScore";

/**
 * We create this function because a lot of methods of ProxyNetworkProvider are not implemented yet.
 */
export class APCNetworkProvider {

    private readonly apiProvider: ApiNetworkProvider;
    private readonly gatewayProvider: ProxyNetworkProvider;
    private readonly itemsDatabase: ItemsDatabase;
    private readonly eggsDatabase: EggsDatabase;

    private readonly apiRequestsMonitor: RequestsMonitor = new RequestsMonitor();
    private readonly gatewayRequestMonitor: RequestsMonitor = new RequestsMonitor();

    private readonly nftsCache: Map<string, APCNft> = new Map();

    private readonly pendingRequests_getPenguinFromId = new Cache<string, Promise<IPenguin>>();
    private readonly pendingRequests_getRankedPenguins = new Cache<string, Promise<IPenguin[]>>();

    get lastMinuteRequests() {
        return {
            api: this.apiRequestsMonitor.lastMinuteRequests,
            gateway: this.gatewayRequestMonitor.lastMinuteRequests
        };
    }

    constructor(gatewayUrl: string, apiUrl: string, itemsDatabase: ItemsDatabase, eggsDatabase: EggsDatabase) {
        this.gatewayProvider = new ProxyNetworkProvider(gatewayUrl, {
            timeout: 15_000
        });
        this.apiProvider = new ApiNetworkProvider(apiUrl, {
            timeout: 15_000
        })
        this.itemsDatabase = itemsDatabase;
        this.eggsDatabase = eggsDatabase;
    }

    public async getPenguinFromId(id: string): Promise<IPenguin> {

        return withCache(this.pendingRequests_getPenguinFromId, id, async () => {
            const nfts = await this.getNfts(penguinsCollection, {
                name: id,
                withOwner: true
            });

            nfts.forEach(nft => this.nftsCache.set(toIdentifier(nft.collection, nft.nonce), nft));

            if (nfts.length == 0) throw new Error(`Penguin ${id} not found`);
            if (nfts.length > 1) throw new Error(`Found ${nfts.length} penguins with the name ${getNameFromPenguinId(id)}.`);

            return this.getPenguinFromNft(nfts[0], true);
        }, 3_000);
    }

    public async cacheCollection(collection: string) {
        const nfts = await this.getNfts(collection, { size: 10_000 });
        nfts.forEach(nft => this.nftsCache.set(toIdentifier(nft.collection, nft.nonce), nft));
    }

    /**
     * The API doesn't return owner
     */
    public async getNfts(collection: string, args: { name?: string, withOwner?: boolean, size?: number } = { size: 10_000 }): Promise<APCNft[]> {

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

    public async getAllPenguins(): Promise<IPenguin[]> {
        const penguins = await this.getNfts(penguinsCollection, { size: 10_000 });

        return penguins
            .map(p => this.getPenguinFromNft(p, false));
    }

    public async getRankedPenguins(): Promise<IPenguin[]> {

        return withCache(this.pendingRequests_getRankedPenguins, "", async () => {
            const penguins = await this.getAllPenguins();

            return sortByScore(penguins, this.itemsDatabase);
        }, 60_000);
    }

    public async getRankedPenguin(id: string) {
        const penguins = await this.getRankedPenguins();

        const index = penguins.findIndex(p => p.id == id);

        return {
            rank: index + 1,
            ...penguins[index]
        }
    }

    public async getNft(collection: string, nonce: number): Promise<APCNft> {

        const identifier = toIdentifier(collection, nonce);

        const cacheHit = this.nftsCache.get(identifier);

        if (cacheHit) return cacheHit;

        const nonceAsHex = new Nonce(nonce).hex();
        const response = await this.apiProvider.doGetGeneric(`nfts/${collection}-${nonceAsHex}`);
        this.apiRequestsMonitor.increment();
        const token = APCNft.fromApiHttpResponse(response);

        this.nftsCache.set(identifier, token);

        return token;
    }

    public async getNftsOfAccount(address: IAddress, collections: string[]): Promise<APCNft[]> {

        // set size as lower improve perf, so 1_000 (250 items, 750 penguins) is okay
        const size = 1_000;
        const url = `accounts/${address.bech32()}/nfts?size=${size}&collections=${collections.join(",")}`;

        // we are using the api, while we would use the gateway, because the API handle when the account is empty (and so not founded by the gateway)
        const response = await this.apiProvider.doGetGeneric(url);
        this.apiRequestsMonitor.increment();

        return response
            .map((item: any) => APCNft.fromApiHttpResponse({ owner: address.bech32(), ...item }));
    }

    public async getInventory(address: IAddress) {
        const nfts = await this.getNftsOfAccount(address, allCollections);

        const penguins: IPenguin[] = [];
        const items: IOwnedItem[] = [];
        const eggs: IOwnedEgg[] = [];

        for (const nft of nfts) {
            switch (nft.collection) {
                case penguinsCollection:
                    penguins.push(this.getPenguinFromNft(nft, true));
                    break;

                case eggsCollection: {
                    const egg: IOwnedEgg = {
                        ownedAmount: nft.supply.toNumber(),
                        ...this.getEggsFromNft(nft)
                    };

                    eggs.push(egg);
                    break;
                }

                default:

                    const itemDb = this.itemsDatabase.getItemFromTokenSilent(nft.collection, nft.nonce);

                    if (itemDb != undefined) {
                        const item: IOwnedItem = {
                            ownedAmount: nft.supply.toNumber(),
                            ...this.itemsDatabase.getItemFromToken(nft.collection, nft.nonce)
                        };

                        items.push(item);
                    }
                    else {
                        console.warn(`Unknown item ${nft.collection}-${nft.nonce} when getting inventory`);
                    }
                    break;
            }
        }

        return {
            penguins,
            items,
            eggs
        }
    }

    public async getPenguinsOfAccount(address: IAddress): Promise<IPenguin[]> {
        const accountsNfts = await this.getNftsOfAccount(address, [penguinsCollection]);

        const penguinsPromises = accountsNfts
            .filter(nft => !!nft.owner)
            .map((nft) => this.getPenguinFromNft(nft, true));

        const penguinsNfts = (await Promise.all(penguinsPromises))
            .sort((a, b) => a.nonce - b.nonce);

        return penguinsNfts;

    }

    public async getItemSupplyOfAccount(address: IAddress, id: string): Promise<number> {
        const { identifier } = this.itemsDatabase.getItemFromId(id);

        return this.getSupply(address, identifier);
    }

    public async getSupply(address: IAddress, identifier: string) {

        const url = `accounts/${address.bech32()}/nfts/${identifier}`;
        const nft = await this.apiProvider.doGetGeneric(url)
            .catch((e: ErrNetworkProvider) => {
                if (e.message.match("Token for given account not found")) {
                    return 0;
                }
                else {
                    throw e;
                }
            });
        this.apiRequestsMonitor.increment();

        return nft.balance;
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

        const queryResponse = await this.gatewayProvider.queryContract(query);
        this.gatewayRequestMonitor.increment();
        const endpointDefinition = contract.getEndpoint(contractViewName);

        const { firstValue } = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);

        const activities = (firstValue as any).backingCollection.items
            .map((o: any) => parseActivity(o));

        return activities;
    }

    public async getUriOf(attributes: Attributes, name: string): Promise<string | undefined> {

        const res = await this.gatewayProvider.queryContract({
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
        const res = await this.gatewayProvider.queryContract({
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

        const queryResponse = await this.gatewayProvider.queryContract(query);
        this.gatewayRequestMonitor.increment();
        const endpointDefinition = contract.getEndpoint(contractViewName);
        const { firstValue } = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);


        const reponseOffers = (firstValue as any).items;

        const offers = reponseOffers
            .map((o: any) => parseMultiValueIdAuction(o));

        return offers;
    }

    public async getOffersOfAccount(account: string): Promise<IOffer[]> {
        const offers = await this.getOffers(allCollections);

        return offers.filter(o => o.seller == account);
    }

    public async getPenguinsFromOffers(offers: IOffer[]): Promise<IPenguin[]> {

        if (offers.find(o => o.collection != penguinsCollection)) {
            throw new Error("getPenguinsFromOffers must contains only penguins");
        }

        const penguinsPromises = offers
            .map(o => this.getNft(o.collection, o.nonce));
        const nfts = await Promise.all(penguinsPromises);

        return nfts
            .map(nft => this.getPenguinFromNft(nft, false));
    }

    public getItemsFromOffers(offers: IOffer[]): IItem[] {

        if (offers.find(o => !isCollectionAnItem(o.collection))) {
            throw new Error("getItemsFromOffers contains only items");
        }

        const tokens = offers
            .map(offer => this.itemsDatabase.getItemFromToken(offer.collection, offer.nonce));

        const uniqueIds = [...new Set(tokens.map(token => token.id))];
        const items = uniqueIds
            .map(id => this.itemsDatabase.getItemFromId(id));

        return items;
    }

    public getEggsFromOffers(offers: IOffer[]): IEgg[] {
        if (offers.find(o => o.collection != eggsCollection)) {
            throw new Error("getPenguinsFromOffers must contains only eggs");
        }

        const uniqueNonces = [...new Set(offers.map(o => o.nonce))];

        const eggs = uniqueNonces
            .map(nonce => this.eggsDatabase.getEggFromNonce(nonce));

        return eggs;
    }

    public async getMarketData(collections: string[]): Promise<IMarketData> {


        const contract = await this.getMarketplaceSmartContract();

        const contractViewName = "getMarketData";
        const query = contract.createQuery({
            func: new ContractFunction(contractViewName),
            args: collections.map(c => BytesValue.fromUTF8(c)),
        });

        const queryResponse = await this.gatewayProvider.queryContract(query);
        this.gatewayRequestMonitor.increment();
        const endpointDefinition = contract.getEndpoint(contractViewName);
        const { firstValue } = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);

        return parseMarketData(firstValue);
    }


    private async getMarketplaceSmartContract() {
        const jsonContent: string = await promises.readFile("src/abi/esdt-nft-marketplace.abi.json", { encoding: "utf8" });
        const json = JSON.parse(jsonContent);
        const abiRegistry = AbiRegistry.create(json);
        const abi = new SmartContractAbi(abiRegistry, ["EsdtNftMarketplace"]);

        const contract = new SmartContract({ address: marketplaceContract, abi: abi });
        return contract;
    }


    private async getNewSaleSmartContract() {
        const jsonContent: string = await promises.readFile("src/abi/apc_sales.abi.json", { encoding: "utf8" });
        const json = JSON.parse(jsonContent);
        const abiRegistry = AbiRegistry.create(json);
        const abi = new SmartContractAbi(abiRegistry, ["apc_sales"]);

        const contract = new SmartContract({ address: newSalesContract, abi: abi });
        return contract;
    }

    private async getStakingSmartContract() {
        const jsonContent: string = await promises.readFile("src/abi/nft-staking.abi.json", { encoding: "utf8" });
        const json = JSON.parse(jsonContent);
        const abiRegistry = AbiRegistry.create(json);
        const abi = new SmartContractAbi(abiRegistry, ["nftStaking"]);

        const contract = new SmartContract({ address: nftStakingContract, abi: abi });
        return contract;
    }

    public getPenguinFromNft(nft: APCNft, needOwner: boolean): IPenguin {

        if (nft.assets[0] == undefined) throw new Error(`No CID linked to the nft ${nft.identifier}`);
        if (needOwner && !nft.owner) throw new Error("Missing owner on NFT");



        return {
            id: getIdFromPenguinName(nft.name).toString(),
            type: "penguins",
            displayName: nft.name,

            identifier: toIdentifier(nft.collection, nft.nonce),
            collection: nft.collection,
            nonce: nft.nonce,

            thumbnailUrls: {
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

            equippedItems[slot] = this.itemsDatabase.getItemFromAttributeName(itemName, slot);
        }

        return equippedItems;
    }

    public async getToken(type: ElementType, id: string) {
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

            case "eggs":
                return this.eggsDatabase.getEggFromTier(id as EggTier);

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

        const queryResponse = await this.gatewayProvider.queryContract(query);
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

        const queryResponse = await this.gatewayProvider.queryContract(query);
        this.gatewayRequestMonitor.increment();
        const endpointDefinition = contract.getEndpoint(contractViewName);
        const { secondValue, returnCode }: any = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition); //TODO: Add type        

        return returnCode == 'ok' ? secondValue : 'Unable to fetch data';
    }

    public async getTokensGeneratedByTheSc() {

        const res = await this.apiProvider.doGetGeneric(`accounts/${nftStakingContract}/tokens?${nftStakingToken}`);

        return originalTokensAmountInStakingSc - res[0].balance
    }

    public async getItemsList() {
        interface MyItem {
            slot: string;
            name: string;
            collection: string;
            nonce: number;
        }

        const response = await this.gatewayProvider.queryContract({
            address: customisationContract,
            func: "getItems",
            getEncodedArguments() {
                return [];
            },
        })

        const data = response.returnData
            .map(d => Buffer.from(d, "base64").toString());


        const output: MyItem[] = [];

        for (let i = 0; i < data.length; i += 4) {

            console.log(data[i + 3]);

            output.push({
                slot: data[i],
                name: data[i + 1],
                collection: data[i + 2],
                nonce: parseInt(Buffer.from(data[i + 3], "binary").toString("hex"), 16),
            });
        }
        return output;
    }

    public async getRandomPenguins(count: number): Promise<IPenguin[]> {

        if (count == 0) return [];

        const penguins: IPenguin[] = [];

        for (const nft of this.nftsCache.values()) {
            if (nft.collection != penguinsCollection) continue;

            penguins.push(this.getPenguinFromNft(nft, true));

            if (penguins.length >= count) break;
        }

        if (penguins.length < count) {
            const remainingCount = count - penguins.length;
            const networkPenguins = await this.getRandomPenguinsUnoptimized(remainingCount);
            penguins.push(...networkPenguins);
        }

        return penguins;
    }

    /**
     * Get random penguins without cache checking     
     */
    private async getRandomPenguinsUnoptimized(count: number): Promise<IPenguin[]> {
        return Promise.all(getRandomsPenguinsIds(count)
            .map(async (i) => this.getPenguinFromId(i)))
    }

    public getEggsFromNft(nft: APCNft) {
        if (nft.collection != eggsCollection) throw new Error("Invalid collection");

        return this.eggsDatabase.getEggFromNonce(nft.nonce);
    }

    public async getNewSaleInfo(id: string): Promise<INewSaleData> {

        const contract = await this.getNewSaleSmartContract();

        const contractViewName = "getAuctionStats";
        const query = contract.createQuery({
            func: new ContractFunction(contractViewName),
            args: [new U64Value(id)],
        });

        const queryResponse = await this.gatewayProvider.queryContract(query);

        if (queryResponse.returnCode == "user error") {
            throw new Error(queryResponse.returnMessage);
        }

        this.gatewayRequestMonitor.increment();
        const endpointDefinition = contract.getEndpoint(contractViewName);

        const { firstValue } = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);

        const data = await parseNewSaleData(firstValue, this.getEsdtToken.bind(this));

        return data;
    }

    public async getEsdtToken(identifier: string): Promise<IToken> {

        if (identifier == "EGLD") {
            return {
                decimals: 18,
                symbol: "EGLD",
                identifier: "EGLD"
            }
        }

        const def = await this.gatewayProvider.getDefinitionOfFungibleToken(identifier)

        return {
            decimals: def.decimals,
            symbol: def.name,
            identifier: identifier
        };
    }
}

async function withCache<K, V>(cache: CacheClass<K, V>, key: K, fetchValue: () => V, time?: number): Promise<V> {
    const pendingRequest = cache.get(key);

    if (pendingRequest) {
        return pendingRequest;
    }
    else {

        const request = fetchValue();
        cache.put(key, request, time);

        return request;
    }
}