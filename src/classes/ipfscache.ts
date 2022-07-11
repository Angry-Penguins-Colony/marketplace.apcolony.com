import fs from 'fs';
import { downloadImage, isCID } from '../utils/utils';
import Config from './config';
import RenderAttributes from './RenderAttributes';
import colors from "colors";
import sharp from 'sharp';
const Hash = require('ipfs-only-hash')

export default class IPFSCache {

    private readonly _ipfsGateway: string;
    private readonly _ipfsCacheFolder: string;

    constructor(ipfsGateway: string, ipfsCacheFolder: string) {
        this._ipfsCacheFolder = ipfsCacheFolder;
        this._ipfsGateway = ipfsGateway;
    }

    public async downloadAllItemsCIDs(config: Config): Promise<void[]> {
        return this.downloadCIDs(config.allCIDs);
    }

    public async downloadItems(renderAttributes: RenderAttributes, config: Config) {

        const allCIDs = renderAttributes.getAllKvps()
            .map(([slot, item]) => config.getCid(slot, item));

        return this.downloadCIDs(allCIDs);
    }

    public async downloadCIDs(cid: string[]) {
        const downloadPromises = cid.map((cid) => this.downloadCID(cid));

        return Promise.all(downloadPromises);
    }

    public async downloadCID(cid: string, cidPathSuffix: string = ""): Promise<void> {
        if (await this.existInCache(cid)) return;

        const savePath = this.getPath(cid);
        const savePathFolders = savePath.slice(0, savePath.lastIndexOf("/"));

        if (!fs.existsSync(savePathFolders)) fs.mkdirSync(savePathFolders, { recursive: true });

        await downloadImage(this._ipfsGateway + cid + "/" + cidPathSuffix, savePath);
        await this.assertImageInGoodFormat(savePath);
    }

    private async assertImageInGoodFormat(path: string): Promise<void> {

        const image = sharp(path);

        const metadata = await image.metadata()
            .catch((err) => { throw new Error(`Cannot get metadata of ${path}. The error is ` + err) });

        const depth = metadata.depth;
        if (depth != "uchar") {
            throw new Error(`The image ${path} is not encoded with 8 bits per channel. NodeJS can't support it.`);
        }
    }

    private getPath(cid: string): string {
        return `${this._ipfsCacheFolder}/${cid}.png`;
    }

    private async existInCache(cid: string): Promise<boolean> {

        const path = this.getPath(cid);

        if (fs.existsSync(path)) {

            // The CID can be QmQyu1jfTbqnQ5MCdZ7iYUWx6h2KP4a922WZnboBuveqAa/badges-00001-render.png, 
            // so we cannot check if it is corrupted
            if (isCID(cid) == true) {
                const isCorrupted = await this.isFileCorrupted(path, cid);

                if (isCorrupted) {
                    console.log(colors.yellow(`[WARNING] The file named ${cid} is corrupted. Its CID is ${await this.calculateCID(path)}`));
                }

                return !isCorrupted;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }

    // TODO: move to utils
    private async isFileCorrupted(path: string, expectedCID: string): Promise<boolean> {
        if (fs.existsSync(path) == false) {
            throw new Error("The file you want to check if corrupted is missing.");
        }

        const buffer = fs.readFileSync(path);
        const calculatedCID = await Hash.of(buffer);

        return calculatedCID != expectedCID;
    }

    // TODO: move to utils
    private async calculateCID(path: string): Promise<boolean> {
        if (fs.existsSync(path) == false) {
            throw new Error("The file you want to check if corrupted is missing.");
        }

        const buffer = fs.readFileSync(path);
        const calculatedCID = await Hash.of(buffer);

        return calculatedCID;
    }
}