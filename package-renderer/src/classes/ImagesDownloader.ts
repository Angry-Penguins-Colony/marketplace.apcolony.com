import fs from 'fs';
import { downloadImage, sleep } from '../utils/utils';
import sharp from 'sharp';
import Bottleneck from 'bottleneck';
import { SingleBar, Presets } from 'cli-progress';

export default class ImagesDownloader {

    public readonly cacheFolder: string = "./images_cache";
    private readonly _downloadLimiter: Bottleneck;

    constructor() {
        this._downloadLimiter = new Bottleneck({
            maxConcurrent: 5,
            minTime: 0 // no minTime
        });

    }

    public async downloadImages(cid: string[]) {

        console.log(`⌛ Downloading images to ${this.cacheFolder}.`);

        const progressBar = new SingleBar({}, Presets.shades_classic);
        progressBar.start(cid.length, 0);

        const downloadPromises = cid
            .map((cid) => this.downloadImage(cid)
                .then(() => progressBar.increment()));

        await Promise.all(downloadPromises);

        progressBar.stop();
        console.log("✔ All images downloaded.");
    }

    public async downloadImage(cid: string): Promise<void> {
        if (this.existInCache(cid)) return;

        await this._downloadLimiter.schedule(async () => {
            const savePath = this.getPath(cid);
            const savePathFolders = savePath.slice(0, savePath.lastIndexOf("/"));

            if (!fs.existsSync(savePathFolders)) fs.mkdirSync(savePathFolders, { recursive: true });

            // TODO: (REFACTOR) this is tight coupled to s3 link
            const buffer = await downloadImage(`https://apc-items.s3.eu-west-3.amazonaws.com/render/${cid}-render.png`, savePath);
            await sleep(500); // sleep to let the file be written
            await this.assertImageInGoodFormat(buffer, cid);
        });
    }

    private async assertImageInGoodFormat(imageBuffer: Buffer, cid: string): Promise<void> {

        const image = sharp(imageBuffer);

        const metadata = await image.metadata()
            .catch((err) => {
                throw new Error(`Cannot get metadata of ${cid}. The error is ${err}.`)
            });

        const depth = metadata.depth;
        if (depth != "uchar") {
            throw new Error(`The image ${cid} is not encoded with 8 bits per channel. NodeJS can't support it.`);
        }
    }

    private getPath(cid: string): string {
        return `${this.cacheFolder}/${cid}.png`;
    }

    private existInCache(cid: string): boolean {

        const path = this.getPath(cid);

        return fs.existsSync(path);
    }

    public toPath(cid: string) {
        return `${this.cacheFolder}/${cid}.png`;
    }
}