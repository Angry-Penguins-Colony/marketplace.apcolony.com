/**
 * Send renderImage with a random attributes.
 */

import { userConfig } from "@apc/renderer/dist/config";
import { getRandomAttributes } from "@apc/renderer/dist/utils/random";
import { sendRenderImage } from "./functions/sendRenderImage";

main();

async function main() {
    const { hash } = await sendRenderImage(getRandomAttributes(userConfig.itemsCID, []));

    console.log(`Transaction hash: ${hash}`);
}

