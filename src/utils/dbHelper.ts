import { IItem } from "@apcolony/marketplace-api";
import { items } from "../const";
import item from "../routes/items/item";
import { splitCollectionAndNonce } from "./string";

export function getItemFromToken(collection: string, nonce: number) {
    const item = items.find(item => {

        const { collection: itemCollection, nonce: itemNonce } = splitCollectionAndNonce(item.identifier);

        return itemCollection == collection && itemNonce == nonce;
    });

    if (!item) throw new Error(`No item found for ${collection} and ${nonce}`);

    return item;
}

export function getItemFromName(name: string, slot: string) {

    const item = items.find(item => item.name == name && item.slot.toLowerCase() == slot.toLowerCase());

    if (!item) throw new Error(`No item found for ${name} and ${slot}`);

    return item;
}