import { capitalize } from "../utils/utils";


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

    public getAllKvps(): [string, string][] {
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

    public toAttributes() {

        return Array.from(this._itemsBySlot.entries())
            .filter(([slot]) => !this.doEquipDefaultItem(slot))
            .map(entry => capitalize(entry[0]) + ":" + capitalize(entry[1].replace("-", " ")))
            .join(";");
    }

    public toFilename() {
        return Array.from(this._itemsBySlot.entries())
            .map(entry => entry[0] + "_" + entry[1])
            .join("+");
    }
}