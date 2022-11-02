import { capitalize, getOccurences } from "../utils/utils";
import ItemsDatabase from "@apcolony/db-marketplace/out/ItemsDatabase";

export const ERR_BAD_FORMAT = "Bad format. Cannot parse render attributes";
export const ERR_EMPTY_SLOT_KEY = "Bad format. Slot key is empty";
export const ERR_EMPTY_SLOT_VALUE = "Bad format. Slot value is empty";

interface IItem {
    id: string;
    name: string;
    slot: string;
}

/**
 * The items to render.
 */
export default class RenderAttributes {

    private readonly _idsBySlot: Map<string, string>;
    public readonly badgeNumber: number;

    /**
     * Return a copy of idsBySlot. Modify it will not modify the defaultLayers of the RenderAttributes.
     */
    public get idsBySlot(): Map<string, string> {
        return new Map<string, string>(this._idsBySlot);
    }

    private get slots(): string[] {
        return Array.from(this._idsBySlot.keys());
    }

    constructor(
        idsBySlot: Iterable<readonly [string, string]>,
        badgeNumber: number,
    ) {
        this._idsBySlot = new Map<string, string>(idsBySlot);
        this.badgeNumber = badgeNumber;

        for (const [slot, id] of this._idsBySlot) {
            if (id == undefined) throw new Error("Item set is undefined at slot: " + slot);
        }
    }

    public getIdsBySlot(): [string, string][] {
        return Array.from(this._idsBySlot.entries());
    }

    public getId(slot: string): string {
        const id = this._idsBySlot.get(slot);

        if (!id) throw new Error("Missing item for slot: " + slot);

        return id;
    }

    public hasSlot(slot: string): boolean {
        return this._idsBySlot.has(slot);
    }

    public static fromAttributes(
        attributes: string,
        badgeNumber: number,
        itemsDatabase: IItem[]
    ): RenderAttributes {


        if (!attributes) return new RenderAttributes([], badgeNumber);

        if (getOccurences(attributes, ":") != (getOccurences(attributes, ";") + 1)) throw new Error(ERR_BAD_FORMAT);

        const idBySlot = new Map<string, string>();

        const entries = attributes.split(";");

        for (const entry of entries) {
            let [slot, itemName] = entry.split(":");

            if (!slot) throw new Error(ERR_EMPTY_SLOT_KEY);
            if (!itemName) throw new Error(ERR_EMPTY_SLOT_VALUE);

            slot = slot.toLowerCase().trim();
            itemName = itemName.trim()

            if (itemName == "unequipped") continue;

            // We setup itemsCID with unique ID as key instead of names
            //      (e.g. "1" instead of "eyes-beak-pixel")
            // But so, we need a link between names and ID. 

            // TODO: REFACTOR: We are tight coupled to our own output "devnetToolDeploy" here. 
            //  If we (I hope) open our code, that's really bad for others people who would use our code.
            // 
            // The best way should be that the blockchain owns the link between names and ID, 
            // but the way the attributes are, we can't for the moment.
            // 
            // What could be done is to push a .json containing metadata (with server-push-render), 
            // and set the NFT attributes with a struct containing everything we need (instead of the string that is parsed inside the TopEncode method)

            const databaseId = itemsDatabase
                .find(i => i.name == itemName && i.slot.toLowerCase() == slot.toLowerCase())?.id;
            if (!databaseId) throw new Error(`Missing id for ${itemName}`);

            idBySlot.set(slot.toLowerCase(), databaseId);
        }

        return new RenderAttributes(idBySlot, badgeNumber);
    }


    public toAttributes(itemsDatabase: ItemsDatabase, requiredSlots: string[] = []) {

        const slots = [...new Set(this.slots.concat(requiredSlots))];
        const attributes = [];

        for (const slot of slots) {
            if (!this.hasSlot(slot)) {
                attributes.push([slot, "unequipped"])
            }
            else {
                const databaseID = this.getId(slot);
                const attributeName = itemsDatabase.getItemFromId(databaseID).attributeName;
                if (!attributeName) throw new Error(`Missing name for id : "${databaseID}"`);

                attributes.push([slot, attributeName]);
            }
        }

        return attributes
            .map(([slot, attributeName]) => capitalize(slot) + ":" + attributeName)
            .join(";");
    }

    public toFilename() {
        return Array.from(this._idsBySlot.entries())
            .map(entry => entry[0] + "_" + entry[1])
            .join("+");
    }
}