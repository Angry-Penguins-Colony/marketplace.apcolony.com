import ItemsDatabase from "@apcolony/db-marketplace/out/ItemsDatabase";
import { APCNetworkProvider } from "../classes/APCNetworkProvider";
import { itemsCollection, itemsDatabase, penguinsCollection, penguinsCount } from "../const";
import { parseAttributes } from "./string";

export function isCollectionAnItem(collection: string) {

    return Object.values(itemsCollection).flat().includes(collection);
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

    const missingItems = await getMissingItems(networkProvider, itemsDatabase);

    if (missingItems.size > 0) {
        const message = [];

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

async function getMissingItems(networkProvider: APCNetworkProvider, itemsDatabase: ItemsDatabase) {
    const nfts = await networkProvider.getNfts(penguinsCollection, {
        size: 10_000
    });

    const missingItems = new Map<string, { slot: string, identifiers: string[] }>();

    for (const nft of nfts) {
        nft.owner = "erd1";
        const attributes = parseAttributes(nft.attributes.toString());

        for (const { slot, itemName } of attributes) {
            if (itemName == "unequipped") continue;

            try {

                itemsDatabase.getItemFromAttributeName(itemName, slot);
            }
            catch (err: any) {
                if (err.message.includes("Unknown item with attributeName")) {

                    missingItems.set(
                        itemName,
                        {
                            slot: missingItems.get(itemName)?.slot || slot,
                            identifiers: [...(missingItems.get(itemName)?.identifiers || []), nft.identifier]
                        });
                }
                else {
                    throw err;
                }
            }
        }
    }

    return missingItems;
}