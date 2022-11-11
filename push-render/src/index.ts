import 'dotenv/config'
import { sleep } from "ts-apc-utils";
import ReadGateway from "./classes/ReadGateway";
import config from "./config";
import WriteGateway from "./classes/WriteGateway";
import { envVariables, requestsPerMinutesToMinTime } from "./utils";
import { SmartContract } from "@elrondnetwork/erdjs/out";
import { PinataPin } from './classes/PinataPin';
import colors from "colors";
import { IItemToProcess } from './interfaces/IItemToProcess';
import BigNumber from "bignumber.js";
import { officialGatewayMaxRPS } from './const';
import Bottleneck from 'bottleneck';
import { renderConfig } from '@apcolony/renderer';
import RenderAttributes from '@apcolony/renderer/dist/classes/RenderAttributes';
import ImageRenderer from '@apcolony/renderer/dist/classes/ImageRenderer';
import "dotenv/config";
import { UrisKvp } from './structs/CIDKvp';
import throng from 'throng';
import ImagesDownloader from '@apcolony/renderer/dist/classes/ImagesDownloader';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
const Hash = require('ipfs-only-hash')
import sharp from "sharp";

throng(1, main);

async function main() {

    const minTime = requestsPerMinutesToMinTime(officialGatewayMaxRPS);

    console.log("Starting server-push-render");
    console.log(`\t- Network: ${process.env.NETWORK_TYPE}`);
    console.log("\t- Customisation contract: ", config.customisationContract.bech32());
    console.log(`\t- Sending from address: ${envVariables.senderAddress.bech32()}`);
    console.log(`\t- Waiting ${minTime}ms between checks`);
    console.log("\n");

    const gatewayLimiter = new Bottleneck({
        minTime: minTime
    });

    const readGateway = new ReadGateway(config.gatewayUrl, config.customisationContract, gatewayLimiter, config.itemsDatabase);
    const writeGateway = new WriteGateway(config.gatewayUrl, envVariables.senderAddress, envVariables.signer, gatewayLimiter, config.itemsDatabase);
    const customisationSC = new SmartContract({ address: config.customisationContract });
    const pinata = new PinataPin(envVariables.pinataApiKey, envVariables.pinataApiSecret, "pin_folder");
    const imagesDownloader = new ImagesDownloader();
    const imageRenderer = new ImageRenderer(renderConfig, imagesDownloader);
    const client = new S3Client(
        {
            region: "eu-west-3",
            credentials: {
                accessKeyId: envVariables.awsAccessKeyId,
                secretAccessKey: envVariables.awsSecretAccessKey
            }
        });

    await Promise.all([
        pinata.testAuthentication(),
        writeGateway.sync(),
        imagesDownloader.downloadCIDs(renderConfig.allCIDs),
    ]);

    const alreadyProcessedCID: string[] = [];

    while (true) {

        const queue = await readGateway.getToBuildQueue()
            .catch((e) => {
                console.error("Error while fetching the queue. Retrying in 5s");
                console.trace(e);
                return [];
            })

        if (queue.length > 0) {

            const itemsPromises = queue
                .map(async (item) => {
                    const rendering = await renderAdvanced(item.renderAttribute, imageRenderer);
                    return {
                        badgeNumber: item.badgeNumber,
                        ...rendering
                    }
                });

            const items = (await Promise.all(itemsPromises))
                .filter((item) => item != undefined && item.cid != undefined && alreadyProcessedCID.includes(item.cid) == false)
                .map((item: any) => {
                    return {
                        uri: "https://ipfs.io/ipfs/" + item.cid,
                        ...item
                    }
                });


            if (items.length > 0) {
                console.log(`\nProcessing ${items.length} elements from the rendering queue...`)

                await claimIfNeeded(readGateway, writeGateway, customisationSC, config.claimThreshold);

                async function uploadToS3({ cid, imageBuffer }: IItemToProcess) {

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

                await Promise.all([
                    pinata.multiplePin(items),
                    writeGateway.setUris(items, customisationSC),
                    items.map(i => uploadToS3(i))
                ])

                for (const item of items) {
                    alreadyProcessedCID.push(item.cid);
                }
            }
        }

        await sleep(requestsPerMinutesToMinTime(officialGatewayMaxRPS) + 10)
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

async function claimIfNeeded(readGateway: ReadGateway, writeGateway: WriteGateway, customisationSC: SmartContract, claimThreshold: BigNumber) {

    if (claimThreshold.isNaN()) throw new Error("claimThreshold is not a number");

    const senderBalance = await readGateway.getBalance(writeGateway.senderAddress);

    if (senderBalance.isLessThanOrEqualTo(claimThreshold)) {
        const contractBalance = await readGateway.getBalance(customisationSC.getAddress());

        if (contractBalance.isGreaterThan(0)) {
            const { hash, nonce } = await writeGateway.claimBalance(customisationSC);

            const newSenderBalance = await readGateway.getBalance(writeGateway.senderAddress);
            const totalClaimed = newSenderBalance.minus(senderBalance);
            console.log(`Claimed ${totalClaimed} balance. Hash: ${hash} Nonce: ${nonce}`.green);
        }
        else {
            console.warn("⚠️ The sender balance is below the threshold but the contract has no balance.".yellow);
        }
    }
}
