import RenderAttributes from "./RenderAttributes";
import mergeImages from 'merge-images';
import { Canvas, Image } from 'canvas';
import IPlugin from "../interfaces/IPlugin";
import colors from "colors";
import { tryRewriteLogLine } from "../utils/utils";
import Config from "./config";
import IPFSCache from "./ipfscache";

export default class ImageRenderer {
    private readonly mimeType: string;
    private readonly config: Config;
    private readonly ipfsCache: IPFSCache;

    constructor(
        config: Config
    ) {
        this.config = config;
        this.mimeType = config.renderMIMEType;
        this.ipfsCache = new IPFSCache(config.ipfsGateway, config.ipfsCacheFolder);
    }

    public async downloadImages() {
        const cid = this.config.allCIDs();
        let downloadedImages = 0;
        const totalImages = cid.length;

        console.log(`⌛ Downloading ${totalImages} images async.`);

        const downloadPromises = cid.map((cid) => {
            return this.ipfsCache.downloadCID(cid)
                .then(() => {
                    downloadedImages++;

                    tryRewriteLogLine(`⌛ Downloaded ${downloadedImages}/${totalImages} images.\r`);
                })
        });

        await Promise.all(downloadPromises);

        tryRewriteLogLine("✔ All images downloaded.\n");
    }


    public async render(renderAttributes: RenderAttributes, plugins: IPlugin[]): Promise<Buffer> {

        const watch = new RenderingTimeWatcher();
        watch.start();

        for (const plugin of plugins) {
            if (plugin.beforeRender) {
                renderAttributes = await plugin.beforeRender(renderAttributes, {
                    config: this.config,
                    ipfsCache: this.ipfsCache
                });
            }
        }
        watch.next();

        let imageBuffer = await this.merge(this.config.toPaths(renderAttributes), {
            format: this.mimeType
        });
        watch.next();

        for (const plugin of plugins) {
            if (plugin.modifyRender) {
                imageBuffer = await plugin.modifyRender(imageBuffer, renderAttributes);
            }
        }
        watch.next();

        for (const plugin of plugins) {
            if (plugin.onRenderComplete) {
                plugin.onRenderComplete(imageBuffer, renderAttributes);
            }
        }
        watch.next();

        for (const plugin of plugins) {
            if (plugin.lateModifyRender) {
                imageBuffer = await plugin.lateModifyRender(imageBuffer, renderAttributes);
            }
        }

        watch.end();
        watch.log();

        return imageBuffer;
    }

    private async merge(layersPath: string[], options: { format: string }): Promise<Buffer> {
        if (layersPath.length == 0) throw new Error("Not implemented yet. Cannot generetae a penguin with no image (later, we will show a default image)");

        let merged = await mergeImages(layersPath, {
            Canvas: Canvas,
            Image: Image,
            format: options.format
        })
            .catch(err => { throw Error("Merge error: " + err) });

        merged = merged.slice("data:image/jpeg;base64,".length);

        return Buffer.from(merged, 'base64');
    }
}

enum RenderingKey {
    BeforeRender = "Pl-BR",
    DownloadItems = "DI",
    Merge = "ME",
    ModifyRender = "Pl-MR",
    OnRenderComplete = "Pl-RC",
    LateModifyRender = "Pl-LateMR",
}

class RenderingTimeWatcher {
    private duration: Map<RenderingKey, number> = new Map();
    private currentWatch: { key: RenderingKey, start: number } | undefined;

    private startTime: number | undefined = undefined;
    private endTime: number | undefined = undefined;

    public start() {
        this.startTime = Date.now()

        this.next();
    }

    public next() {
        if (this.currentWatch) {
            this.duration.set(this.currentWatch.key, Date.now() - this.currentWatch.start);
        }

        this.currentWatch = {
            key: this.getNextKey(),
            start: Date.now()
        }
    }

    public end() {
        this.endTime = Date.now();
    }

    private getNextKey(): RenderingKey {
        return RenderingKey[Object.keys(RenderingKey)[this.duration.size] as keyof typeof RenderingKey];
    }

    public log() {
        if (!this.startTime || !this.endTime) throw new Error("Render start not found");

        const time = [] as string[];

        this.duration.forEach((duration, key) => {
            time.push(`${key}: ${duration}ms`);
        });

        const totalTime = this.endTime - this.startTime;

        const detailedDuration = colors.grey(`(${time.join(", ")})`)
        console.log(`Render tooks ${totalTime}ms ${detailedDuration}`);
    }
}