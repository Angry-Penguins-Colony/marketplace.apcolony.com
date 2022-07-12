import { ImageRenderer } from "@apc/renderer";
import Config from "@apc/renderer/dist/classes/config";
import RenderAttributes from "@apc/renderer/dist/classes/RenderAttributes";
import IPlugin from "@apc/renderer/dist/interfaces/IPlugin";
const Hash = require('ipfs-only-hash')
import { CIDKvp } from "../structs/CIDKvp";
import colors from "colors";

export default class MyImageRenderer extends ImageRenderer {
    constructor(config: Config) {
        super(config);
    }

    async buildCidKvp(item: RenderAttributes): Promise<CIDKvp | undefined> {

        try {

            const imageBuffer = await this.render(item, this._config.plugins);
            const cid: string = await Hash.of(imageBuffer);

            return {
                cid: cid,
                attributes: item
            };
        }
        catch (e: any) {

            console.error(`${"[Error]".red} ${e.toString().red} => Skipping item ${item.toAttributes().grey} `);

            return undefined;
        }
    }
}