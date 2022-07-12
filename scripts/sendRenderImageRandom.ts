/**
 * Send renderImage with a random attributes.
 */

import { getRandomAttributes } from "@apc/renderer/dist/utils/random";
import { userConfig } from "../src/config/render.config";
import { sendRenderImage } from "./functions/sendRenderImage";

main();

async function main() {
    const { hash } = await sendRenderImage(getRandomAttributes(userConfig.itemsCID, []));

    console.log(`Transaction hash: ${hash}`);
}

