import { capitalize, getOccurences } from "../utils/utils";

export const ERR_BAD_FORMAT = "Bad format. Cannot parse render attributes";
export const ERR_EMPTY_SLOT_KEY = "Bad format. Slot key is empty";
export const ERR_EMPTY_SLOT_VALUE = "Bad format. Slot value is empty";

/**
 * The items to render.
 */
export default class RenderAttributes {

    private readonly _layersOrder: string[];
    private readonly _defaultLayers: { [key: string]: string; } | undefined;

    private readonly _itemsBySlot: Map<string, string>;

    /**
     * Return a copy of itemsBySlot. Modify it will not modify the defaultLayers of the RenderAttributes.
     */
    public get itemsBySlot(): Map<string, string> {
        return new Map<string, string>(this._itemsBySlot);
    }

    /**
     * Return a copy of layersOrder. Modify it will not modify the defaultLayers of the RenderAttributes.
     */
    public get layersOrder(): string[] {
        return Array.from(this._layersOrder);
    }

    /**
     * Return a copy of defaultLayers. Modify it will not modify the defaultLayers of the RenderAttributes.
     */
    public get defaultLayers(): { [key: string]: string; } {
        return Object.assign({}, this._defaultLayers);
    }

    constructor(
        itemsBySlot: Iterable<readonly [string, string]>,
        layersOrder: string[],
        defaultLayers?: { [key: string]: string; }
    ) {

        this._layersOrder = layersOrder;
        this._defaultLayers = defaultLayers;

        this._itemsBySlot = new Map<string, string>(itemsBySlot);
        this.addDefaultValues(this._itemsBySlot);

    }

    public getItemsBySlot(): [string, string][] {
        return Array.from(this._itemsBySlot.entries());
    }

    public getItem(slot: string): string {
        const item = this._itemsBySlot.get(slot);

        if (!item) throw new Error("Missing item for slot: " + slot);

        return item;
    }

    public hasSlot(slot: string): boolean {
        return this._itemsBySlot.has(slot);
    }

    public doEquipDefaultItem(slot: string): boolean {

        if (!this._defaultLayers) return false;

        const defaultItem = this._defaultLayers[slot];
        const currentItem = this._itemsBySlot.get(slot);

        return defaultItem == currentItem;
    }

    private addDefaultValues(itemsBySlot: Map<string, string>) {

        for (const slot in this._defaultLayers) {

            if (itemsBySlot.has(slot)) continue;

            const defaultImage = this._defaultLayers[slot];

            if (defaultImage != undefined) {
                itemsBySlot.set(slot, defaultImage);
            }
        }
    }

    public static fromAttributes(
        attributes: string,
        layersOrder: string[],
        defaultLayers?: { [key: string]: string; }
    ): RenderAttributes {


        if (!attributes) return new RenderAttributes([], layersOrder, defaultLayers);

        if (getOccurences(attributes, ":") != (getOccurences(attributes, ";") + 1)) throw new Error(ERR_BAD_FORMAT);

        const itemsBySlot = new Map<string, string>();

        const entries = attributes.split(";");

        for (const entry of entries) {
            let [key, value] = entry.split(":");

            if (!key) throw new Error(ERR_EMPTY_SLOT_KEY);
            if (!value) throw new Error(ERR_EMPTY_SLOT_VALUE);

            key = key.toLowerCase().trim();
            value = value.toLowerCase().replace(" ", "-").trim();

            itemsBySlot.set(key.toLowerCase(), value);
        }

        return new RenderAttributes(itemsBySlot, layersOrder, defaultLayers);
    }


    public toAttributes() {

        return Array.from(this._itemsBySlot.entries())
            .filter(([slot]) => !this.doEquipDefaultItem(slot))
            .map(([slot, item]) => capitalize(slot) + ":" + capitalize(item.replace("-", " ")))
            .join(";");
    }

    public toFilename() {
        return Array.from(this._itemsBySlot.entries())
            .map(entry => entry[0] + "_" + entry[1])
            .join("+");
    }
}