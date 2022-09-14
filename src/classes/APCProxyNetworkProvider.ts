import { IAddress, IAttributesStatus, IItem, IPenguin } from "@apcolony/marketplace-api";
import Attributes from "@apcolony/marketplace-api/out/classes";
import { NonFungibleTokenOfAccountOnNetwork, ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";
import { ArgSerializer, BytesValue } from "@elrondnetwork/erdjs/out";
import { items, customisationContract } from "../const";
import { extractCIDFromIPFS, parseAttributes, splitCollectionAndNonce } from "../utils/string";

/**
 * We create this function because a lot of methods of ProxyNetworkProvider are not implemented yet.
 */
export class APCProxyNetworkProvider extends ProxyNetworkProvider {

    private readonly _gatewayUrl: string;

    constructor(url: string) {
        super(url, {
            timeout: 15_000
        });
        this._gatewayUrl = url;
    }

    /**
     * Fixed method of getNonFungibleTokenOfAccount; This one fill properly the "assets" property.
     */
    public async fixed_getNonFungibleTokenOfAccount(address: IAddress, collection: string, nonce: number) {


        const url = `address/${address.bech32()}/nft/${collection}/nonce/${nonce.valueOf()}`;
        const response = await this.doGetGeneric(url);

        const tokenData = NonFungibleTokenOfAccountOnNetwork.fromProxyHttpResponseByNonce(response.tokenData);
        tokenData.assets = (Array.from(response.tokenData.uris ?? []) as string[])
            .map(b64 => Buffer.from(b64, "base64").toString());

        return tokenData;
    }

    public async getNftsOfAccount(address: IAddress): Promise<NonFungibleTokenOfAccountOnNetwork[]> {

        const response = await this.doGetGeneric(`address/${address.bech32()}/esdt`);

        const tokens = Object.values(response.esdts)
            .filter((item: any) => item.nonce >= 0) // we keep only NFTs        
            .map((item: any) => {
                let token = NonFungibleTokenOfAccountOnNetwork.fromProxyHttpResponse(item);
                token.assets = (Object.values(item.uris) as string[])
                    .map((uri: string) => Buffer.from(uri, "base64").toString());

                return token;
            });

        return tokens;
    }

    public async getCidOf(attributes: Attributes): Promise<string | undefined> {

        const res = await this.queryContract({
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
        const res = await this.queryContract({
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

        console.log(`NFT assets for ${item.identifier}: ${nft.assets.length}`);

        return {
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