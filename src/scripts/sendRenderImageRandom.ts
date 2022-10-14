/**
 * Send renderImage with a random attributes.
 */

import RenderAttributes from "@apcolony/renderer/dist/classes/RenderAttributes";
import { userConfig } from "@apcolony/renderer/dist/config";
import { getRandomAttributes } from "@apcolony/renderer/dist/utils/random";
import { UserSigner } from "@elrondnetwork/erdjs-walletcore/out";
import { Address } from "@elrondnetwork/erdjs/out";
import Bottleneck from "bottleneck";
import WriteGateway from "../classes/WriteGateway";
import config from "../config";
import { sendRenderImage } from "./functions/sendRenderImage";

main();

async function main() {

    const imagesToSend = process.argv[2] ? parseInt(process.argv[2]) : 1;

    if (isNaN(imagesToSend)) throw new Error("Invalid number of images to send");

    const gateway = await initializeWriteGateway();
    console.log(`Sending ${imagesToSend} images with ${gateway.senderAddress.bech32()}...`);

    const defaultLayersIds = Object.values(userConfig.defaultLayers ?? {});

    for (let i = 0; i < imagesToSend; i++) {
        const attributes = new RenderAttributes(getRandomAttributes(
            userConfig.itemsCID,
            defaultLayersIds
        ), []);

        const { hash } = await sendRenderImage(attributes, gateway);

        console.log(`Transaction hash: ${hash}`);
    }

    console.log("Done!");
}


async function initializeWriteGateway() {
    const sender = {
        address: process.env.SENDER_TEST_BECH32,
        pem: process.env.SENDER_TEST_PEM
    };

    if (!sender.address) throw new Error("Missing env SENDER_TEST_ADDRESS");
    if (!sender.pem) throw new Error("Missing env SENDER_TEST_PEM");

    const writeGateway = new WriteGateway(config.gatewayUrl, new Address(sender.address), UserSigner.fromPem(sender.pem), new Bottleneck());

    await writeGateway.sync();

    return writeGateway;
}