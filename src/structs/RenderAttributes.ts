import { capitalize } from "ts-apc-utils";
import { getOccurences, getRandomIn } from "../utils";

export const ERR_BAD_FORMAT = "Bad format. Cannot parse render attributes";
export const ERR_EMPTY_SLOT_KEY = "Bad format. Slot key is empty";
export const ERR_EMPTY_SLOT_VALUE = "Bad format. Slot value is empty";

export default class RenderAttributes {

    private readonly _itemsBySlot: Map<string, string>;

    constructor(itemsBySlot?: Iterable<readonly [string, string]>) {
        this._itemsBySlot = new Map<string, string>(itemsBySlot);
    }

    public toAttributes() {

        return Array.from(this._itemsBySlot.entries())
            .map(entry => capitalize(entry[0]) + ":" + capitalize(entry[1].replace("-", " ")))
            .join(";");
    }

    public hasSlot(slot: string): boolean {
        return this._itemsBySlot.has(slot);
    }

    public static fromAttributes(attributes: string): RenderAttributes {


        if (!attributes) return new RenderAttributes();

        if (getOccurences(attributes, ":") != (getOccurences(attributes, ";") + 1)) throw new Error(ERR_BAD_FORMAT);

        const itemsBySlot = new Map<string, string>();

        const entries = attributes.split(";");

        for (const entry of entries) {
            const [key, value] = entry.split(":");

            if (!key) throw new Error(ERR_EMPTY_SLOT_KEY);
            if (!value) throw new Error(ERR_EMPTY_SLOT_VALUE);

            itemsBySlot.set(key, value);
        }

        return new RenderAttributes(itemsBySlot);
    }

    public static getRandom(): RenderAttributes {

        const { minSlot, maxSlot, prefixes, itemsNames } = {
            minSlot: 1,
            maxSlot: 3,
            prefixes: ["pirate", "cold", "french", "acidic", "flat", "jumpy", "graceful", "happy", "high", "icy", "immense", "precious", "sticky", "sweet", "tasty", "tender", "toxic", "warm", "wet", "wooden", "wonderful", "yellow", "zippy"],
            itemsNames: ["hat", "shirt", "pants", "shoes"]
        }

        const itemsBySlot = new Map<string, string>();
        const slot = Math.floor(Math.random() * (maxSlot - minSlot + 1)) + minSlot;

        for (let i = 0; i <= slot; i++) {

            const itemName = getRandomIn(prefixes) + " " + getRandomIn(itemsNames);

            itemsBySlot.set("slot #" + i.toString(), itemName);
        }

        return new RenderAttributes(itemsBySlot);
    }
}