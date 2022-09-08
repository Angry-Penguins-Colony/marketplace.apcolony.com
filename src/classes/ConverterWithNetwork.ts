import { IItem, IPenguin } from "@apcolony/marketplace-api";
import { NonFungibleTokenOfAccountOnNetwork } from "@elrondnetwork/erdjs-network-providers/out";
import { customisationContract, items } from "../const";
import { extractCIDFromIPFS, parseAttributes, splitCollectionAndNonce } from "../utils/string";
import { ProxyNetworkProviderExtended } from "./ProxyNetworkProviderExtended";

/**
 * Convert objects that needs network calls to be converted.
 */
export default class ConverterWithNetwork {

    private readonly _proxyNetwork: ProxyNetworkProviderExtended;

    constructor(proxyNetwork: ProxyNetworkProviderExtended) {
        this._proxyNetwork = proxyNetwork;
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

        const nft = await this._proxyNetwork.fixed_getNonFungibleTokenOfAccount(customisationContract, ticker, nonce);

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