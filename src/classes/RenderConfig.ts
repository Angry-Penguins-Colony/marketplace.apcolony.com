import ImageMIMEType from '../enums/ImageMIMEType';
import { UnknownSlot, UnknownItem, MissingSlot } from '../errors/configErrors';
import IPlugin from '../interfaces/IPlugin';
import IRenderConfigOptions from '../interfaces/IRenderConfigOptions';
import RenderAttributes from './RenderAttributes';
import { sortImages } from '../utils/utils';
import { devnetToolDeploy } from '../devnet.tool-result';

export default class RenderConfig {

    readonly ipfsGateway: string;
    readonly renderMIMEType: ImageMIMEType;
    readonly itemsCID: { [key: string]: { [key: string]: string; }; };
    readonly ipfsCachePath: string;

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


        return cids;
    }

    constructor(config: IRenderConfigOptions, plugins: IPlugin[] = []) {

        if (!config) throw new Error("config is undefined");

        this.ipfsGateway = config.ipfsGateway ?? "https://ipfs.io/ipfs/";

        this.renderMIMEType = config.renderMIMEType ?? ImageMIMEType.JPEG;
        this.layersOrder = config.layersOrder ?? Object.keys(config.itemsCID);
        this.itemsCID = config.itemsCID;
        this.defaultLayers = config.defaultLayers ?? undefined;
        this.ipfsCachePath = process.env.RENDERER_IPFS_CACHE_PATH ?? "./ipfs_cache";
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


    public getCid(slot: string, itemName: string): string {

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

    public toPaths(renderAttributes: RenderAttributes): string[] {


        const paths: [string, string][] = [];

        renderAttributes.getItemsBySlot().forEach(([slot, itemName]) => {

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
            const databaseId = devnetToolDeploy.items.find(item => item.name == itemName)?.id;

            if (!databaseId) throw new Error(`Missing id for ${itemName}`);

            paths.push([slot, this.toPath(slot, databaseId)]);
        });

        return sortImages(paths, renderAttributes.layersOrder)
            .map(kvp => kvp[1]);
    }

    private toPath(slot: string, itemName: string) {
        return `${this.ipfsCachePath}/${this.getCid(slot, itemName)}.png`;
    }
}

