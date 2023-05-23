import { IItem, IPenguin } from "@apcolony/marketplace-api";
import fs from "fs";
import { parse } from "path";
import { ItemsCollections } from "./types/config";
import { getItemWebThumbnail, getRenderWebThumbnail, ipfsGateway } from "./uris";
import { toIdentifier } from "./utils";

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
    stakePoints: number;
    slot: string;
    attributeName: string;
    supply?: number;

    collection?: string | null | undefined;
    nonce?: number | null | undefined;
    devnetCollection?: string | null | undefined;
    devnetNonce?: number | null | undefined;
};

export default class ItemsDatabase {

    private readonly _cachedSlotSupply = new Map<string, number>();

    public get items(): IItem[] {
        return Array.from(this._items);
    }

    constructor(private readonly _items: IItem[]) { }

    public static fromJson(parsedItems: ItemInDatabase[], useDevnetCollection: boolean) {

        const items: IItem[] = [];

        for (const parsedItem of parsedItems) {

            const {
                id,
                name,
                collection: mainnetCollection,
                nonce: mainnetNonce,
                devnetCollection,
                devnetNonce,
                attributeName,
                slot,
                renderUrl,
                supply,
                stakePoints
            } = parsedItem;

            if (name == "Default") break;


            if (!id) {
                console.error(`Item ${name} has no id`);
                continue;
            }

            const selectedCollection = useDevnetCollection ? devnetCollection : mainnetCollection;
            const selectedNonce = useDevnetCollection ? devnetNonce : mainnetNonce;

            if (!selectedCollection || !selectedNonce) {
                console.warn("No collection or nonce for id:", id, "in", useDevnetCollection ? "devnet" : "mainnet");
                continue;
            }

            const item: IItem = {
                id,
                type: "items",
                displayName: name,
                attributeName: attributeName,

                thumbnailUrls: {
                    high: getItemWebThumbnail(id),
                    small: getItemWebThumbnail(id), // TODO: use a small thumbnail
                },
                collection: selectedCollection,
                nonce: selectedNonce,
                identifier: toIdentifier(selectedCollection, selectedNonce),

                slot,
                description: "", // TODO:
                renderUrls: {
                    ipfs: renderUrl,
                    high: getRenderWebThumbnail(id),
                },
                supply: supply ?? -1,
                stakePoints: stakePoints
            }

            items.push(item);
        }

        return new ItemsDatabase(items);
    }

    public calculateItemScore(item: IItem) {
        return 1 / (item.supply / this.getSupplyOfSlot(item.slot));
    }

    public calculatePenguinsScore(penguin: IPenguin): number {

        let score = 0;

        for (const slot in penguin.equippedItems) {
            const item = penguin.equippedItems[slot];

            score += this.calculateItemScore(item);
        }

        return score;
    }

    public getSupplyOfSlot(slot: string): number {
        const cacheHit = this._cachedSlotSupply.get(slot);

        if (cacheHit != undefined) {
            return cacheHit;
        }


        const items = this._items.filter(i => i.slot == slot);
        const supply = items.reduce((acc, item) => acc + item.supply, 0);

        this._cachedSlotSupply.set(slot, supply);

        return supply;
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

    public getItemsOfSlot(slot: string) {
        return this._items.filter(item => item.slot == slot);
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

    public getItemFromTokenSilent(collection: string, nonce: number) {
        return this._items.find(item => item.collection === collection && item.nonce === nonce);
    }

    public getItemFromToken(collection: string, nonce: number) {
        const item = this.getItemFromTokenSilent(collection, nonce);
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

    public getUniqueItemsCollections(): ItemsCollections {
        const identifiers: ItemsCollections = {
            "background": [],
            "beak": [],
            "clothes": [],
            "eyes": [],
            "hat": [],
            "skin": [],
            "weapon": [],
        };

        for (const item of this._items) {
            if (!item.collection) continue;
            addCollection(item.slot, item.collection);
        }

        return identifiers;

        function addCollection(slot: string, identifier: string) {

            const currentArray = identifiers[slot as keyof typeof identifiers] || [];

            // make sure there is no duplicates
            if (currentArray.includes(identifier)) return;

            currentArray.push(identifier);

            identifiers[slot as keyof typeof identifiers] = currentArray;
        }
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
