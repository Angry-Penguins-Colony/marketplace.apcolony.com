import { IItem } from "@apcolony/marketplace-api";
import fs from "fs";


export default class ItemsDatabase {

    constructor(private readonly items: IItem[]) { }

    public static fromItemsDatabaseJSON(path: string, identifiers: { id: string, collection: string, nonce: number, identifier: string }[]) {
        const parsedItems: {
            id: string,
            descriptionCID: string,
            renderCID: string,
            thumbnailCID: string,
            name: string
            stakePoints: number,
            slot: string,
            attributeName: string,
            supply: number,
        }[] = JSON.parse(fs.readFileSync(path, 'utf8'));

        const items: IItem[] = parsedItems
            .filter(({ name }) => name != "Default")
            .map(({ id, name, renderCID, thumbnailCID, slot, supply }) => {

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

                    thumbnailCID,
                    identifier: item?.identifier ?? "",
                    collection: item?.collection ?? "",
                    nonce: item?.nonce ?? 0,

                    slot,
                    description: "", // TODO:
                    renderCID,
                    supply
                }
            });

        return new ItemsDatabase(items);
    }

    public idExist(id: string) {
        return this.items.some(item => item.id == id);
    }

    public getItemFromId(id: string): IItem {
        const item = this.items.find(item => item.id == id);
        if (!item) {
            throw new Error(`Item ${id} not found`);
        }
        return item;
    }

    public getItemFromNameAndSlot(name: string, slot: string): IItem {
        const item = this.items.find(item => item.name == name && item.slot == slot);
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