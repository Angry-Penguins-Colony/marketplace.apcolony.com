import RenderAttributes from "./RenderAttributes";
import mergeImages from 'merge-images';
import { Canvas, Image } from 'canvas';
import IPlugin from "../interfaces/IPlugin";
import colors from "colors";
import RenderConfig from "./RenderConfig";
import IPFSCache from "./ipfscache";
import Bottleneck from "bottleneck";

export default class ImageRenderer {
    protected readonly _mimeType: string;
    protected readonly _config: RenderConfig;
    protected readonly _ipfsCache: IPFSCache;

    public get config(): RenderConfig {
        return this._config;
    }

    constructor(
        config: RenderConfig
    ) {
        this._config = config;
        this._mimeType = config.renderMIMEType;
        this._ipfsCache = new IPFSCache(config.ipfsGateway, config.ipfsCacheFolder);
    }

    public async downloadImages(options?: { verbose: boolean }): Promise<void> {

        const limiter = new Bottleneck({
            maxConcurrent: 5,
            minTime: 0 // no minTime
        });

        log("⌛ Downloading images.", false);

        const totalImages = this._config.allCIDs.length;
        let imagesDownloaded = 0;

        const downloadPromises = this._config.allCIDs
            .map((cid) => limiter.schedule(downloadCID, cid, this._ipfsCache));

        await Promise.all(downloadPromises);

        log("\n✔ All images downloaded.", false);

        function log(msg: string, isProgress: boolean) {
            if (options && options?.verbose == true) {
                if (isProgress && process.stdout && typeof process.stdout.cursorTo === 'function' && typeof process.stdout.write === 'function') {
                    process.stdout.cursorTo(0);
                    process.stdout.write(msg);
                }
                else {
                    console.log(msg);
                }
            }
        }

        async function downloadCID(cid: string, ipfsCache: IPFSCache) {
            await ipfsCache.downloadCID(cid);

            imagesDownloaded++;

            log(`${imagesDownloaded}/${totalImages} images downloaded.`, true);
        }
    }


    public async render(renderAttributes: RenderAttributes, plugins: IPlugin[], options?: { verbose: boolean }): Promise<Buffer> {

        const watch = new RenderingTimeWatcher();
        watch.start();

        for (const plugin of plugins) {
            if (plugin.beforeRender) {
                renderAttributes = await plugin.beforeRender(renderAttributes, {
                    config: this._config,
                    ipfsCache: this._ipfsCache
                });
            }
        }
        watch.next();

        let imageBuffer = await this.merge(this._config.toPaths(renderAttributes), {
            format: this._mimeType
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

        if (options && options?.verbose == true) {
            watch.log();
        }

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