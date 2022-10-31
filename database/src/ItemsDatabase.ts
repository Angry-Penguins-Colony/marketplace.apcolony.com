import { IItem } from "@apcolony/marketplace-api";
import fs from "fs";
import { getItemWebThumbnail, getRenderWebThumbnail, ipfsGateway } from "./uris";


interface Item extends IItem {
    attributeName: string
}

type DeployedItem = {
    id: string;
    collection: string;
    nonce: number;
    identifier: string;
};

type ItemInDatabase = {
    id: string;
    descriptionCID?: string;
    renderCID: string;
    thumbnailCID?: string;
    name: string;
    stakePoints?: number;
    slot: string;
    attributeName: string;
    supply?: number;
};

export default class ItemsDatabase {

    constructor(private readonly items: Item[]) { }

    public static fromJson(parsedItems: ItemInDatabase[], identifiers: DeployedItem[]) {
        const items: Item[] = parsedItems
            .filter(({ name }) => name != "Default")
            .map(({ id, name, renderCID, thumbnailCID, slot, supply, attributeName }): Item => {

                if (!id) {
                    throw new Error(`Item ${name} has no id`);
                }

                const item = identifiers.find(i => i.id == id);

                if (!item) {
                    console.warn(`Item ${name} (${id}) not found in identifiers`);
                }

                return {
                    id,
                    type: "items",
                    name,
                    attributeName,

                    thumbnailUrls: {
                        ipfs: ipfsGateway + thumbnailCID,
                        high: getItemWebThumbnail(id),
                        small: getItemWebThumbnail(id), // TODO: use a small thumbnail
                    },
                    identifier: item?.identifier ?? "",
                    collection: item?.collection ?? "",
                    nonce: item?.nonce ?? 0,

                    slot,
                    description: "", // TODO:
                    renderUrls: {
                        ipfs: ipfsGateway + renderCID,
                        high: getRenderWebThumbnail(id),
                    },
                    supply: supply ?? -1
                }
            });

        return new ItemsDatabase(items);
    }

    public idExist(id: string) {
        return this.items.some(item => item.id == id);
    }

    public getItemFromId(id: string): Item {
        const item = this.items.find(item => item.id == id);
        if (!item) {
            throw new Error(`Item ${id} not found`);
        }
        return item;
    }

    public getItemFromNameAndSlot(attributeName: string, slot: string): Item {
        const item = this.items.find(item => item.attributeName == attributeName && item.slot == slot);
        if (!item) {
            throw new Error(`Unknown item ${name} for slot ${slot}`);
        }
        return item;
    }

    public getItemFromToken(collection: string, nonce: number) {
        const item = this.items.find(item => item.collection === collection && item.nonce === nonce);
        if (!item) {
            throw new Error(`Unknown item with collection ${collection} and nonce ${nonce}`);
        }
        return item;
    }
}