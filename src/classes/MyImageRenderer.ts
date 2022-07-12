import { ImageRenderer } from "@apc/renderer";
import RenderConfig from "@apc/renderer/dist/classes/RenderConfig";
import RenderAttributes from "@apc/renderer/dist/classes/RenderAttributes";
import { IItemToProcess } from "../interfaces/IItemToProcess";
const Hash = require('ipfs-only-hash')

export default class MyImageRenderer extends ImageRenderer {
    constructor(config: RenderConfig) {
        super(config);
    }

    async renderAdvanced(item: RenderAttributes): Promise<IItemToProcess | undefined> {

        try {

            const imageBuffer = await this.render(item, this._config.plugins);
            const cid: string = await Hash.of(imageBuffer);

            return {
                cid: cid,
                attributes: item,
                imageBuffer: imageBuffer
            };
        }
        catch (e: any) {

            console.error(`${"[Error]".red} ${e.toString().red} => Skipping item ${[...item.itemsBySlot.entries()].toString().grey} `);

            return undefined;
        }
    }
}