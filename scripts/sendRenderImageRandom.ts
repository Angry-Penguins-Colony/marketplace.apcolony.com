/**
 * Send renderImage with a random attributes.
 */

import RenderAttributes_old from "../src/structs/RenderAttributes";
import { sendRenderImage } from "./functions/sendRenderImage";

main();

async function main() {
    const { hash } = await sendRenderImage(RenderAttributes_old.getRandom());

    console.log(`Transaction hash: ${hash}`);
}