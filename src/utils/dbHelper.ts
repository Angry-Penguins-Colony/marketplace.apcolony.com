import { IItem } from "@apcolony/marketplace-api";
import { Nonce } from "@elrondnetwork/erdjs-network-providers/out/primitives";
import { APCNetworkProvider } from "../classes/APCNetworkProvider";
import { items, penguinsCollection, penguinsCount } from "../const";
import item from "../routes/items/item";
import { parseAttributes, splitCollectionAndNonce } from "./string";

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

export function getItemFromAttributeName(name: string, slot: string) {

    return items
        .find(item => item.attributeName == name && item.slot.toLowerCase() == slot.toLowerCase());
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

export function getRandomsPenguinsIds(count: number): string[] {

    if (count > penguinsCount) {
        throw new Error(`Penguins count is ${penguinsCount} and you want ${count} penguins`);
    }


    const ids: number[] = [];

    while (ids.length < count) {
        const randomId = Math.floor(Math.random() * penguinsCount) + 1;

        if (ids.includes(randomId)) continue;

        ids.push(randomId);
    }

    return ids.map(id => id.toString());
}

export async function logErrorIfMissingItems(networkProvider: APCNetworkProvider) {

    const missingItems = await getMissingItems(networkProvider);

    if (missingItems.size > 0) {
        let message = [];

        for (const [item, value] of missingItems) {
            message.push({
                item,
                slot: value.slot,
                exampleIdentifier: value.identifiers[0],
            });
        }

        console.error("Missing items from NFTs in database:");
        console.table(message)
    }
    else {
        console.log("No missing items from NFTs in database.");
    }
}

async function getMissingItems(networkProvider: APCNetworkProvider) {
    const nfts = await networkProvider.getNfts(penguinsCollection, {
        size: 5555
    });

    const missingItems = new Map<string, { slot: string, identifiers: string[] }>();

    for (const nft of nfts) {
        nft.owner = "erd1";
        const attributes = parseAttributes(nft.attributes.toString());

        for (const { slot, itemName } of attributes) {
            if (itemName == "unequipped") continue;

            const item = getItemFromAttributeName(itemName, slot);

            if (item == undefined) {
                missingItems.set(
                    itemName,
                    {
                        slot: missingItems.get(itemName)?.slot || slot,
                        identifiers: [...(missingItems.get(itemName)?.identifiers || []), nft.identifier]
                    });
            }
        }
    }

    return missingItems;

    function parseItemNameFromError(e: any) {
        const line: string = e.toString().split("\n")[0];

        const item = line
            .substring(0, line.indexOf(" at slot "))
            .replace("Error: No item found for ", "")
            .trim();

        return item;
    }
}