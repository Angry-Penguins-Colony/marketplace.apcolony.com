import { IItem } from "@apcolony/marketplace-api";
import fs from "fs";
import { getItemWebThumbnail, getRenderWebThumbnail, ipfsGateway } from "./uris";

export type DeployedItem = {
    id: string;
    collection: string;
    nonce: number;
    identifier: string;
};

type ItemInDatabase = {
    id: string;
    descriptionCID?: string;
    renderUrl: string;
    thumbnailCID?: string;
    name: string;
    stakePoints?: number;
    slot: string;
    attributeName: string;
    supply?: number;
};

export default class ItemsDatabase {

    public get items(): IItem[] {
        return Array.from(this._items);
    }

    constructor(private readonly _items: IItem[]) { }

    public static fromJson(parsedItems: ItemInDatabase[], deployedItems: DeployedItem[]) {
        const items: IItem[] = parsedItems
            .filter(({ name }) => name != "Default")
            .map(({ name, id, renderUrl, thumbnailCID, slot, supply, attributeName }): IItem => {

                if (!id) {
                    throw new Error(`Item ${name} has no id`);
                }

                const item = deployedItems.find(i => i.id == id);

                if (!item) {
                    console.warn(`Missing id ${id} for item ${name} in deploy json.`);
                }

                return {
                    id,
                    type: "items",
                    displayName: name,
                    attributeName: attributeName,

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
                        ipfs: renderUrl,
                        high: getRenderWebThumbnail(id),
                    },
                    supply: supply ?? -1
                }
            });

        return new ItemsDatabase(items);
    }

    public idExist(id: string) {
        return this._items.some(item => item.id == id);
    }

    public getItemFromId(id: string): IItem {
        const item = this._items.find(item => item.id == id);
        if (!item) {
            throw new Error(`Item ${id} not found`);
        }
        return item;
    }

    public getItemFromAttributeName(attributeName: string, slot: string): IItem {
        const item = this._items.find(item => item.attributeName == attributeName && item.slot == slot);
        if (!item) {
            throw new Error(`Unknown item with attributeName ${attributeName} for slot ${slot}`);
        }
        return item;
    }

    public getItemFromIdentifier(identifier: string): IItem | undefined {
        return this._items.find(i => i.identifier == identifier);
    }

    public getItemFromToken(collection: string, nonce: number) {
        const item = this._items.find(item => item.collection === collection && item.nonce === nonce);
        if (!item) {
            throw new Error(`Unknown item with collection ${collection} and nonce ${nonce}`);
        }
        return item;
    }

    public getSlotFromIdentifier(identifier: string): string {
        const item = this._items.find(item => item.identifier == identifier);

        if (!item) throw new Error(`No slot found for ${identifier}`);

        return item.slot;
    }

    public getRandomItem() {
        const item = this._items[Math.floor(Math.random() * this._items.length)];

        return item;
    }


    public getRandomItems(count: number) {
        const _items = Array.from(this._items);
        const output = [];

        for (let i = 0; i < count; i++) {
            const index = Math.floor(Math.random() * _items.length);
            output.push(_items[index]);
            _items.splice(index, 1);
        }

        return output;
    }

    public getTokenFromItemID(id: string): { collection: string, nonce: number } {
        const item = this._items.find(i => i.id == id);

        if (!item) throw new Error("Item not found");
        if (!item.identifier) throw new Error("Item has no identifier");

        return splitCollectionAndNonce(item.identifier);
    }
}

// TODO: move to 
export function splitCollectionAndNonce(identifier: string) {
    const splited = identifier.split('-');

    if (splited.length == 3) {
        return {
            collection: splited[0] + '-' + splited[1],
            nonce: parseInt(splited[2], 16)
        };
    } else {
        throw new Error(`Invalid identifier ${identifier}`);
    }
}
