import { IItem, IPenguin } from "@apcolony/marketplace-api";
import { NonFungibleTokenOfAccountOnNetwork } from "@elrondnetwork/erdjs-network-providers/out";
import { items } from "../const";
import { extractCIDFromIPFS, parseAttributes } from "../utils/string";
import { ProxyNetwork } from "./ProxyNetwork";

// REFACTOR: I don't really like that name. It look like we are converting networks.
/**
 * Convert objects that needs network calls to be converted.
 */
export default class ConverterWithNetwork {

    private readonly _proxyNetwork: ProxyNetwork;

    constructor(proxyNetwork: ProxyNetwork) {
        this._proxyNetwork = proxyNetwork;
    }

    getPenguinFromNft(nft: NonFungibleTokenOfAccountOnNetwork): IPenguin {

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
            equippedItems: this.getEquippedItemsFromAttributes(nft.attributes.toString()),
        }
    }

    private getEquippedItemsFromAttributes(rawAttributes: string): { [key: string]: IItem } {

        const attributes = parseAttributes(rawAttributes);
        const equippedItems = {} as { [key: string]: IItem };

        for (const { slot, itemName } of attributes) {
            if (itemName == "unequipped") continue;

            equippedItems[slot] = this.getItemFromName(itemName, slot);
        }

        return equippedItems;
    }

    getItemFromName(name: string, slot: string): IItem {

        const item = items.find(item => item.name == name && item.slot == slot);

        if (!item) throw new Error(`No item found for ${name} and ${slot}`);

        const identifier = item.identifier;

        // TODO: get info from blockchain w/ identifier

        return {
            identifier: identifier,
            name: name,
            slot: slot,
            nonce: 0, //TODO:
            thumbnailCID: "", //TODO:
            renderCID: "",
            description: "", //TODO:
            amount: -1, // TODO: amount is linked to a wallet, but here's we don't have wallet; make this property optionally undefined for SDK
        }
    }

}