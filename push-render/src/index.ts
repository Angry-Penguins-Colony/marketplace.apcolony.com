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
import { minTimeOfficialGateway, officialGatewayMaxRPS } from './const';
import Bottleneck from 'bottleneck';
import { renderConfig } from '@apcolony/renderer';
import RenderAttributes from '@apcolony/renderer/dist/classes/RenderAttributes';
import ImageRenderer from '@apcolony/renderer/dist/classes/ImageRenderer';
import "dotenv/config";
import { UrisKvp } from './structs/CIDKvp';
import throng from 'throng';
import ImagesDownloader from '@apcolony/renderer/dist/classes/ImagesDownloader';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from "sharp";
import { enableReporting, reportErrorToMail } from './classes/ErrorsReporter';
import { ItemProcessor } from './classes/ItemProcessor';
import { MemoryTracker } from './classes/MemoryTracker';

enableReporting();

if (process.env.LOG_RSS == "true") {
    new MemoryTracker(300).start();
}

main();

async function main() {


    console.log("Starting server-push-render");
    console.log(`\t- Network: ${process.env.NETWORK_TYPE}`);
    console.log("\t- Customisation contract: ", config.customisationContract.bech32());
    console.log(`\t- Sending from address: ${envVariables.senderAddress.bech32()}`);
    console.log(`\t- Waiting ${minTimeOfficialGateway}ms between checks`);
    console.log("\n");

    const { readGateway, writeGateway, customisationSc, pinata, imagesDownloader, itemProcessor } = newFromConfig();

    await init();

    const alreadyProcessedCID: RenderAttributes[] = [];

    while (true) {
        await claimIfNeeded(readGateway, writeGateway, customisationSc, config.claimThreshold);

        const queue = await readGateway.getToBuildQueue()
            .catch((e) => {
                console.error("Error while fetching the queue. Retrying in 5s");
                console.trace(e);
                return [];
            })

        for (const item of queue) {
            if (alreadyProcessedCID.includes(item)) continue;

            await itemProcessor.processItem(item);
            alreadyProcessedCID.push(item);
        }

        await sleep(requestsPerMinutesToMinTime(officialGatewayMaxRPS) + 10)

        if (queue.length > 0) {
            console.log(`${queue.length} items processed.`);
        }
    }

    async function init() {
        await Promise.all([
            pinata.testAuthentication()
                .catch(() => console.error("⚠️ Pinata authentication failed.")),
            writeGateway.sync()
                .catch((e) => reportErrorToMail(e)),
            imagesDownloader.downloadCIDs(renderConfig.allCIDs),
        ]);
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

function newFromConfig() {

    const gatewayLimiter = new Bottleneck({
        minTime: minTimeOfficialGateway
    });

    const readGateway = new ReadGateway(config.gatewayUrl, config.customisationContract, gatewayLimiter, config.itemsDatabase);
    const writeGateway = new WriteGateway(config.gatewayUrl, envVariables.senderAddress, envVariables.signer, gatewayLimiter, config.itemsDatabase);
    const customisationSc = new SmartContract({ address: config.customisationContract });
    const imagesDownloader = new ImagesDownloader();
    const pinata = new PinataPin(envVariables.pinataApiKey, envVariables.pinataApiSecret, "pin_folder");
    const imageRenderer = new ImageRenderer(renderConfig, imagesDownloader);
    const s3Client = new S3Client(
        {
            region: "eu-west-3",
            credentials: {
                accessKeyId: envVariables.awsAccessKeyId,
                secretAccessKey: envVariables.awsSecretAccessKey
            }
        });

    const itemProcessor = new ItemProcessor(imageRenderer, pinata, writeGateway, customisationSc, s3Client);

    return {
        readGateway,
        writeGateway,
        customisationSc,
        itemProcessor,
        pinata,
        imagesDownloader
    }
}