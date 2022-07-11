import ImageMIMEType from '../enums/ImageMIMEType';
import { UnknownSlot, UnknownItem, MissingSlot } from '../errors/configErrors';
import IPlugin from './plugins/IPlugin';
import IConfigOptions from './IConfigOptions';

export default class Config {

    readonly ipfsGateway: string;
    readonly renderMIMEType: ImageMIMEType;
    readonly itemsCID: { [key: string]: { [key: string]: string; }; };
    readonly maxRequestsPerSecond: number;
    readonly maxConcurrentPerRequest: number;
    readonly ipfsCacheFolder: string;

    readonly layersOrder: string[];
    readonly defaultLayers?: { [key: string]: string; };

    readonly plugins: IPlugin[];

    constructor(config: IConfigOptions, plugins: IPlugin[] = []) {

        if (!config) throw new Error("config is undefined");

        this.ipfsGateway = config.ipfsGateway ?? "https://ipfs.io/ipfs/";

        this.renderMIMEType = config.renderMIMEType ?? ImageMIMEType.JPEG;
        this.layersOrder = config.layersOrder ?? Object.keys(config.itemsCID);
        this.itemsCID = config.itemsCID;
        this.defaultLayers = config.defaultLayers ?? undefined;
        this.maxRequestsPerSecond = config.maxPerRequest ?? 1_000_000_000;
        this.maxConcurrentPerRequest = config.maxConcurrentPerRequest ?? 1_000_000_000;
        this.ipfsCacheFolder = config.ipfsCacheFolder ?? "ipfs_cache";
        this.plugins = plugins;

        for (const plugin of this.plugins) {
            if (plugin.checkConfig) {
                plugin.checkConfig(config);
            }
        }

        for (const slot in this.defaultLayers) {
            if (this.itemsCID[slot] == undefined) throw new UnknownSlot(slot, "defaultLayers");

            const defaultItem = this.defaultLayers[slot];
            if (this.itemsCID[slot][defaultItem] == undefined) throw new UnknownItem(defaultItem, "defaultLayers");
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

    public getCid(slot: string, itemName: string) {

        for (const plugin of this.plugins) {
            if (plugin.getCID) {
                const cid = plugin.getCID(slot, itemName);
                if (cid) return cid;
            }
        }

        if (this.itemsCID[slot] == undefined) throw new Error(`Unknow slot: ${slot}.`);
        if (this.itemsCID[slot][itemName] == undefined) throw new UnknownItem(itemName, "getCid");

        return this.itemsCID[slot][itemName];
    }

    public allCIDs(): string[] {
        const cids = [] as string[];

        for (const slotKey in this.itemsCID) {
            for (const itemKey in this.itemsCID[slotKey]) {
                const cid = this.itemsCID[slotKey][itemKey];
                cids.push(cid);
            }
        }


        return cids;
    }
}

