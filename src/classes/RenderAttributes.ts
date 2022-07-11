import { capitalize, sortImages } from "../utils/utils";
import { Request } from 'express';
import Config from "./config";

/**
 * The items to render.
 */
export default class RenderAttributes {

    public readonly config: Config;
    private readonly _itemsBySlot: Map<string, string>;

    public get itemsBySlot(): Map<string, string> {
        return new Map<string, string>(this._itemsBySlot);
    }

    constructor(itemsBySlot: Iterable<readonly [string, string]>, config: Config) {

        this.config = config;

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

        return this.config.getCid(slot, item);
    }

    public hasSlot(slot: string): boolean {
        return this._itemsBySlot.has(slot);
    }

    public doEquipDefaultItem(slot: string): boolean {

        if (!this.config.defaultLayers) return false;

        const defaultItem = this.config.defaultLayers[slot];
        const currentItem = this._itemsBySlot.get(slot);

        return defaultItem == currentItem;
    }

    public toPaths(): string[] {

        if (!this.config) throw "Missing config";

        const paths: [string, string][] = [];

        this._itemsBySlot.forEach((item, slot) => {
            if (!this.config) throw "Missing config";
            paths.push([slot, this.toPath(slot, item, this.config)]);
        });

        return sortImages(paths, this.config.layersOrder)
            .map(kvp => kvp[1]);
    }

    public static fromRequest(req: Request, config: Config) {
        const itemsBySlot = new Map<string, string>();

        for (const key in req.query) {
            const value = req.query[key];
            if (value == undefined) continue;
            itemsBySlot.set(key, value.toString());
        }

        return new RenderAttributes(itemsBySlot, config);
    }

    private addDefaultValues(itemsBySlot: Map<string, string>) {

        if (!this.config) throw "Missing config";

        for (const slot in this.config.defaultLayers) {

            if (itemsBySlot.has(slot)) continue;

            const defaultImage = this.config.defaultLayers[slot];

            if (defaultImage != undefined) {
                itemsBySlot.set(slot, defaultImage);
            }
        }
    }

    // TODO: move to IPFS cache class
    private toPath(slot: string, filename: string, config: Config) {
        return "./ipfscache/" + config.getCid(slot, filename) + ".png";
    }
}