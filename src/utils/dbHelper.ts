import { IItem } from "@apcolony/marketplace-api";
import { items } from "../const";
import item from "../routes/items/item";
import { splitCollectionAndNonce } from "./string";

export function getTokenFromItemID(id: string): { collection: string, nonce: number } {
    const item = items.find(i => i.id == id);

    if (!item) throw new Error("Item not found");

    return splitCollectionAndNonce(item.identifier);
}

export function getItemFromToken(collection: string, nonce: number) {
    const item = items.find(item => {

        const { collection: itemCollection, nonce: itemNonce } = splitCollectionAndNonce(item.identifier);

        return itemCollection == collection && itemNonce == nonce;
    });

    if (!item) throw new Error(`No item found for collection ${collection} and ${nonce}`);

    return item;
}

export function getItemFromName(name: string, slot: string) {

    const item = items.find(item => item.name == name && item.slot.toLowerCase() == slot.toLowerCase());

    if (!item) throw new Error(`No item found for ${name} at slot ${slot}`);

    return item;
}

export function getRandomItem() {
    const item = items[Math.floor(Math.random() * items.length)];

    return item;
}

export function getRandomItems(count: number) {
    const _items = Array.from(items);
    const output = [];

    for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * _items.length);
        output.push(_items[index]);
        _items.splice(index, 1);
    }

    return output;
}