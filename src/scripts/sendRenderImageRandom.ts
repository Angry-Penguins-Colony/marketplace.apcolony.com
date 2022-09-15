/**
 * Send renderImage with a random attributes.
 */

import RenderAttributes from "@apc/renderer/dist/classes/RenderAttributes";
import { userConfig } from "@apc/renderer/dist/config";
import { getRandomAttributes } from "@apc/renderer/dist/utils/random";
import { sendRenderImage } from "./functions/sendRenderImage";

main();

async function main() {

    const defaultLayersIds = Object.values(userConfig.defaultLayers ?? {});

    const attributes = new RenderAttributes(getRandomAttributes(
        userConfig.itemsCID,
        defaultLayersIds
    ), []);

    const { hash } = await sendRenderImage(attributes);

    console.log(`Transaction hash: ${hash}`);
}

