/**
 * Send renderImage with a random attributes.
 */

import RenderAttributes from "../src/structs/RenderAttributes";
import { sendRenderImage } from "./functions/sendRenderImage";

main();

async function main() {
    const { hash } = await sendRenderImage(RenderAttributes.getRandom());

    console.log(`Transaction hash: ${hash}`);
}