import ImageMIMEType from '../enums/ImageMIMEType';
import { UnknownSlot, UnknownId, MissingSlot } from '../errors/configErrors';
import IPlugin from '../interfaces/IPlugin';
import { IRenderConfigOptions } from '../interfaces/IRenderConfigOptions';

export default class RenderConfig {

    readonly renderMIMEType: ImageMIMEType;
    readonly itemsCID: { [key: string]: { [key: string]: string; }; };

    readonly layersOrder: string[];
    readonly defaultLayers?: { [key: string]: string; };

    readonly plugins: IPlugin[];

    public get allCIDs(): string[] {
        const cids = [] as string[];

        for (const slotKey in this.itemsCID) {
            for (const itemKey in this.itemsCID[slotKey]) {
                const cid = this.itemsCID[slotKey][itemKey];
                cids.push(cid);
            }
        }

        if (this.defaultLayers) {
            cids.push(...Object.values(this.defaultLayers));
        }

        return cids;
    }

    public get slots(): string[] {
        return Object.keys(this.itemsCID);
    }

    constructor(config: IRenderConfigOptions, plugins: IPlugin[] = []) {

        if (!config) throw new Error("config is undefined");

        this.renderMIMEType = config.renderMIMEType ?? ImageMIMEType.JPEG;
        this.layersOrder = config.layersOrder ?? Object.keys(config.itemsCID);
        this.itemsCID = config.itemsCID;
        this.defaultLayers = config.defaultLayers ?? undefined;

        this.plugins = plugins;

        for (const plugin of this.plugins) {
            if (plugin.checkConfig) {
                plugin.checkConfig(config);
            }
        }

        for (const slot in this.defaultLayers) {
            if (this.itemsCID[slot] == undefined) throw new UnknownSlot(slot, "defaultLayers");
        }

        if (this.layersOrder) {

            const pluginsOwnLayers = this.plugins
                .map(plugin => plugin.ownLayers ?? [])
                .flat()
                .filter(layers => layers.length > 0);

            // detect unknown slots
            for (const slot of this.layersOrder) {
                if (pluginsOwnLayers.includes(slot) == false && this.itemsCID[slot] == undefined) {
                    throw new UnknownSlot(slot, "layersOrder");
                }
            }

            // detect missing slots
            for (const slot in this.itemsCID) {
                if (this.layersOrder.includes(slot) == false) {
                    throw new MissingSlot(slot, "layersOrder");
                }
            }
        }
    }


    public getCid(slot: string, itemName: string): string {

        for (const plugin of this.plugins) {
            if (plugin.getCID) {
                const cid = plugin.getCID(slot, itemName);
                if (cid) return cid;
            }
        }

        if (this.itemsCID[slot] == undefined) throw new Error(`Unknow slot: ${slot}.`);
        if (this.itemsCID[slot][itemName] == undefined) throw new UnknownId(itemName, slot, "getCid");

        return this.itemsCID[slot][itemName];
    }


}

