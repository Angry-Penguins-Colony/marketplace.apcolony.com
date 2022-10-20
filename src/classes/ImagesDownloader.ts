import fs from 'fs';
import { downloadImage, sleep } from '../utils/utils';
import sharp from 'sharp';

export default class ImagesDownloader {

    public readonly ipfsCacheFolder: string = "./images_cache";

    public async downloadImages(cid: string[]) {
        const downloadPromises = cid.map((cid) => this.downloadImage(cid));

        return Promise.all(downloadPromises);
    }

    public async downloadImage(cid: string): Promise<void> {
        if (this.existInCache(cid)) return;

        const savePath = this.getPath(cid);
        const savePathFolders = savePath.slice(0, savePath.lastIndexOf("/"));

        if (!fs.existsSync(savePathFolders)) fs.mkdirSync(savePathFolders, { recursive: true });

        const buffer = await downloadImage(`https://apc-items.s3.eu-west-3.amazonaws.com/render/${cid}-render.png`, savePath);
        await sleep(500); // sleep to let the file be written
        await this.assertImageInGoodFormat(buffer, cid);
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
        return `${this.ipfsCacheFolder}/${cid}.png`;
    }

    private existInCache(cid: string): boolean {

        const path = this.getPath(cid);

        return fs.existsSync(path);
    }

    public toPath(cid: string) {
        return `${this.ipfsCacheFolder}/${cid}.png`;
    }
}