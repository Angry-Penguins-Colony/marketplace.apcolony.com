import { IAddress, IItem, IPenguin } from "@apcolony/marketplace-api";
import { Attributes } from "@apcolony/marketplace-api/out/classes";
import { ApiNetworkProvider, NonFungibleTokenOfAccountOnNetwork, ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";
import { Nonce } from "@elrondnetwork/erdjs-network-providers/out/primitives";
import { ArgSerializer, BytesValue } from "@elrondnetwork/erdjs/out";
import axios from "axios";
import { items, customisationContract, penguinsCollection } from "../const";
import { extractCIDFromIPFS, getIdFromPenguinName, parseAttributes, splitCollectionAndNonce } from "../utils/string";

/**
 * We create this function because a lot of methods of ProxyNetworkProvider are not implemented yet.
 */
export class APCProxyNetworkProvider {

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
        // get all nfts in collection
        const nfts = await this.getNfts(penguinsCollection);

        const nft = nfts.find(nft => getIdFromPenguinName(nft.name).toString() == id);

        if (nft == undefined) return undefined;

        return this.getPenguinFromNft(nft);
    }

    public async getNfts(collection: string): Promise<NonFungibleTokenOfAccountOnNetwork[]> {
        const res = await this.apiProvider.doGetGeneric(`collections/${collection}/nfts`);

        const nfts = Array.from(res)
            .map((raw: any) => {
                const nft = NonFungibleTokenOfAccountOnNetwork.fromApiHttpResponse(raw)

                nft.assets = this.urisFromHttpResponse(raw.uris);

                return nft;
            });

        return nfts;
    }

    public async getNft(collection: string, nonce: number): Promise<NonFungibleTokenOfAccountOnNetwork> {
        let nonceAsHex = new Nonce(nonce).hex();
        let response = await this.apiProvider.doGetGeneric(`nfts/${collection}-${nonceAsHex}`);
        let token = NonFungibleTokenOfAccountOnNetwork.fromApiHttpResponse(response);

        token.assets = this.urisFromHttpResponse(response.uris);

        return token;
    }

    public async getNftsOfAccount(address: IAddress): Promise<NonFungibleTokenOfAccountOnNetwork[]> {

        const response = await this.proxyProvider.doGetGeneric(`address/${address.bech32()}/esdt`);

        const tokens = Object.values(response.esdts)
            .filter((item: any) => item.nonce >= 0) // we keep only NFTs        
            .map((item: any) => {
                let token = NonFungibleTokenOfAccountOnNetwork.fromProxyHttpResponse(item);
                token.assets = this.urisFromHttpResponse(item.uris);

                return token;
            });

        return tokens;
    }

    private urisFromHttpResponse(uris: any): string[] {
        return (Object.values(uris) as string[])
            .map((uri: string) => Buffer.from(uri, "base64").toString());
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


    async getPenguinFromNft(nft: NonFungibleTokenOfAccountOnNetwork): Promise<IPenguin> {

        if (nft.assets[0] == undefined) {
            throw new Error(`No CID linked to the nft ${nft.identifier}`);
        }

        return {
            id: getIdFromPenguinName(nft.name).toString(),
            identifier: nft.identifier,
            name: nft.name,
            nonce: nft.nonce,
            score: -1,
            purchaseDate: new Date(), // TODO:
            thumbnailCID: extractCIDFromIPFS(nft.assets[0]),
            equippedItems: await this.getEquippedItemsFromAttributes(nft.attributes.toString()),
        }
    }

    private async getEquippedItemsFromAttributes(rawAttributes: string): Promise<{ [key: string]: IItem }> {

        const attributes = parseAttributes(rawAttributes);
        const equippedItems = {} as { [key: string]: IItem };

        for (const { slot, itemName } of attributes) {
            if (itemName == "unequipped") continue;

            equippedItems[slot] = await this.getItemFromName(itemName, slot);
        }

        return equippedItems;
    }

    async getItemFromName(name: string, slot: string): Promise<IItem> {

        const item = items.find(item => item.name == name && item.slot.toLowerCase() == slot.toLowerCase());

        if (!item) throw new Error(`No item found for ${name} and ${slot}`);

        const { collection: ticker, nonce } = splitCollectionAndNonce(item.identifier);

        const nft = await this.fixed_getNonFungibleTokenOfAccount(customisationContract, ticker, nonce);

        const id = items.find(item => item.identifier === nft.identifier)?.id;

        if (!id) throw new Error(`No databaseId found for ${nft.identifier}`);

        return {
            id: id,
            identifier: item.identifier,
            name: name,
            slot: slot,
            nonce: nonce,
            thumbnailCID: extractCIDFromIPFS(nft.assets[0]),
            renderCID: extractCIDFromIPFS(nft.assets[1]),
            description: "", //TODO:
            amount: -1, // TODO: amount is linked to a wallet, but here's we don't have wallet; make this property optionally undefined for SDK
        }
    }
}