import RenderAttributes from "./RenderAttributes";
import mergeImages from 'merge-images';
import { Canvas, Image } from 'canvas';
import IPlugin from "./plugins/IPlugin";
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
        this.ipfsCache = new IPFSCache(config);
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
        watch.startRender();

        watch.start(RenderingKey.BeforeRender);
        for (const plugin of plugins) {
            if (plugin.beforeRender) {
                renderAttributes = await plugin.beforeRender(renderAttributes);
            }
        }
        watch.end(RenderingKey.BeforeRender);

        watch.start(RenderingKey.Merge);
        let imageBuffer = await this.merge(renderAttributes.toPaths(), {
            format: this.mimeType
        });
        watch.end(RenderingKey.Merge);

        watch.start(RenderingKey.ModifyRender);
        for (const plugin of plugins) {
            if (plugin.modifyRender) {
                imageBuffer = await plugin.modifyRender(imageBuffer, renderAttributes);
            }
        }
        watch.end(RenderingKey.ModifyRender);

        watch.start(RenderingKey.OnRenderComplete);
        for (const plugin of plugins) {
            if (plugin.onRenderComplete) {
                plugin.onRenderComplete(imageBuffer, renderAttributes);
            }
        }
        watch.end(RenderingKey.OnRenderComplete);


        watch.start(RenderingKey.LateModifyRender);
        for (const plugin of plugins) {
            if (plugin.lateModifyRender) {
                imageBuffer = await plugin.lateModifyRender(imageBuffer, renderAttributes);
            }
        }
        watch.end(RenderingKey.LateModifyRender);

        watch.endRender();
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
    private startTime: Map<RenderingKey, number> = new Map();
    private duration: Map<RenderingKey, number> = new Map();

    private renderStart: number | undefined;
    private renderEnd: number | undefined;

    public startRender() {
        this.renderStart = new Date().getTime();
    }

    public endRender() {
        this.renderEnd = new Date().getTime();
    }

    public start(key: RenderingKey) {
        this.startTime.set(key, new Date().getTime());
    }

    public end(key: RenderingKey) {
        const startTime = this.startTime.get(key);

        if (!startTime) throw new Error(`Start time not found for key ${key}`);

        this.duration.set(key, new Date().getTime() - startTime);
    }

    public log() {
        if (!this.renderEnd || !this.renderStart) throw new Error("Render start not found");

        const time = [] as string[];

        this.duration.forEach((duration, key) => {
            time.push(`${key}: ${duration}ms`);
        });

        const detailedDuration = colors.grey(`(${time.join(", ")})`)
        console.log(`Render tooks ${this.renderEnd - this.renderStart}ms ${detailedDuration}`);
    }
}