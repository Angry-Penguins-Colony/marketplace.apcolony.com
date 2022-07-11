import { capitalize, sortImages } from "../utils/utils";
import { Request } from 'express';

interface ICidGetter {
    getCid(slot: string, itemName: string): string
}

/**
 * The items to render.
 */
export default class RenderAttributes {

    private readonly _cidGetter: ICidGetter;
    private readonly _layersOrder: string[];
    private readonly _defaultLayers: { [key: string]: string; };

    private readonly _itemsBySlot: Map<string, string>;

    public get itemsBySlot(): Map<string, string> {
        return new Map<string, string>(this._itemsBySlot);
    }

    constructor(
        itemsBySlot: Iterable<readonly [string, string]>,
        cidGetter: ICidGetter,
        layersOrder: string[],
        defaultLayers: { [key: string]: string; }
    ) {

        this._cidGetter = cidGetter;
        this._layersOrder = layersOrder;
        this._defaultLayers = defaultLayers;

        this._itemsBySlot = new Map<string, string>(itemsBySlot);
        this.addDefaultValues(this._itemsBySlot);

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

    public allCIDs(): string[] {
        const allCIDs = [] as string[];

        for (const [slot] of this._itemsBySlot) {
            allCIDs.push(this.getCid(slot));
        }

        return allCIDs;
    }

    public getCid(slot: string) {
        const item = this._itemsBySlot.get(slot);

        if (!item) throw "Missing item";

        return this._cidGetter.getCid(slot, item);
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

    public toPaths(): string[] {

        const paths: [string, string][] = [];

        this._itemsBySlot.forEach((item, slot) => {
            paths.push([slot, this.toPath(slot, item)]);
        });

        return sortImages(paths, this._layersOrder)
            .map(kvp => kvp[1]);
    }

    public static fromRequest(
        req: Request,
        cidGetter: ICidGetter,
        layersOrder: string[],
        defaultLayers: { [key: string]: string; }) {
        const itemsBySlot = new Map<string, string>();

        for (const key in req.query) {
            const value = req.query[key];
            if (value == undefined) continue;
            itemsBySlot.set(key, value.toString());
        }

        return new RenderAttributes(
            itemsBySlot,
            cidGetter,
            layersOrder,
            defaultLayers
        );
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

    // TODO: move to IPFS cache class
    private toPath(slot: string, filename: string) {
        return "./ipfscache/" + this._cidGetter.getCid(slot, filename) + ".png";
    }
}