import { IItem, IPenguin } from '@apcolony/marketplace-api';
import { NonFungibleTokenOfAccountOnNetwork } from '@elrondnetwork/erdjs-network-providers/out';
import { items, itemsCollection } from '../const';
import { extractCIDFromIPFS, parseAttributes, removeNonceFromIdentifier } from './string';

export function getPenguinFromNft(nft: NonFungibleTokenOfAccountOnNetwork): IPenguin {

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
        equippedItems: getEquippedItemsFromAttributes(nft.attributes.toString()),
    }
}

export function getItemFromNft(nft: NonFungibleTokenOfAccountOnNetwork): IItem {

    return {
        identifier: nft.identifier,
        nonce: nft.nonce,
        slot: getSlotFromIdentifier(nft.identifier),
        name: nft.name,
        description: "", // TODO:
        thumbnailCID: extractCIDFromIPFS(nft.assets[0]),
        renderCID: extractCIDFromIPFS(nft.assets[1]),
        amount: nft.supply.toNumber(), // TODO:
    }
}

export function getSlotFromIdentifier(identifier: string): string {

    const collection = removeNonceFromIdentifier(identifier);
    const foundSlot = Object.keys(itemsCollection)
        .find(key => (itemsCollection as any)[key] === collection);

    if (!foundSlot) throw new Error(`No slot found for ${identifier}`);

    return foundSlot;
}


export function getEquippedItemsFromAttributes(rawAttributes: string): { [key: string]: IItem } {

    const attributes = parseAttributes(rawAttributes);
    const equippedItems = {} as { [key: string]: IItem };

    for (const { slot, itemName } of attributes) {
        if (itemName == "unequipped") continue;

        equippedItems[slot] = getItemFromName(itemName, slot);
    }

    return equippedItems;
}


export function getItemFromName(name: string, slot: string): IItem {

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

