import { renderConfig } from "@apcolony/renderer";
import ImageRenderer from "@apcolony/renderer/dist/classes/ImageRenderer";
import ImagesDownloader from "@apcolony/renderer/dist/classes/ImagesDownloader";
import RenderAttributes from "@apcolony/renderer/dist/classes/RenderAttributes";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { SmartContract } from "@elrondnetwork/erdjs/out";
import Bottleneck from "bottleneck";
import sharp from "sharp";
import config from "../config";
import { envVariables } from "../utils";
import { reportErrorToMail } from "./ErrorsReporter";
import { PinataPin } from "./PinataPin";
import ReadGateway from "./ReadGateway";
import WriteGateway from "./WriteGateway";
const Hash = require('ipfs-only-hash')

interface Dependencies {
    imageRenderer: ImageRenderer;
    pinata: PinataPin;
    writeGateway: WriteGateway;
    customisationSc: SmartContract
    s3Client: S3Client
}

export class ItemProcessor {
    constructor(
        private readonly imageRenderer: ImageRenderer,
        private readonly pinata: PinataPin,
        private readonly writeGateway: WriteGateway,
        private readonly customisationSc: SmartContract,
        private readonly s3Client: S3Client,
    ) {
    }


    public async processItem(item: RenderAttributes) {

        const render = await renderAdvanced(item, this.imageRenderer);

        if (!render) return;

        return Promise.all(
            [
                this.pinata.pin(render.imageBuffer, render.cid),
                this.writeGateway.setUris([
                    {
                        attributes: item,
                        uri: "https://ipfs.io/ipfs/" + render.cid
                    }
                ], this.customisationSc),
                uploadToS3(render.imageBuffer, render.cid, this.s3Client)
            ]
        );
    }
}


async function renderAdvanced(item: RenderAttributes, imageRenderer: ImageRenderer) {

    try {

        const imageBuffer = await imageRenderer.render(item, imageRenderer.config.plugins);
        const cid: string = await Hash.of(imageBuffer);

        return {
            cid: cid,
            attributes: item,
            imageBuffer: imageBuffer
        };
    }
    catch (e: any) {
        console.error(`${"[Error]".red} ${e.toString().red} => Skipping item ${[...item.idsBySlot.entries()].toString().grey} `);
        console.log(e);
        return undefined;
    }
}

async function uploadToS3(imageBuffer: Buffer, cid: string, client: S3Client) {

    // convert buffer to 
    const jpegBuffer = await sharp(imageBuffer)
        .resize(1024, 1024)
        .jpeg()
        .toBuffer();

    const filename = cid + "-web.jpg";

    const params = {
        Bucket: "apc-penguins",
        Key: filename,
        Body: jpegBuffer,
        ContentType: "image/jpeg",
        ACL: "public-read",
    };

    console.log(`Uploading ${filename} to S3`);

    return client.send(new PutObjectCommand(params));
}