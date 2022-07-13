import 'dotenv/config'
import { sleep } from "ts-apc-utils";
import ReadGateway from "./classes/ReadGateway";
import config from "./config";
import { CIDKvp } from "./structs/CIDKvp";
import WriteGateway from "./classes/WriteGateway";
import { envVariables } from "./utils";
import { ISmartContract, SmartContract } from "@elrondnetwork/erdjs/out";
import { userRenderConfig } from "./config/render.config";
import RenderConfig from "@apc/renderer/dist/classes/RenderConfig";
import { renderConfigPlugins } from "./config/render.plugins.config";
import MyImageRenderer from "./classes/MyImageRenderer";
import { PinataPin } from './classes/PinataPin';
import colors from "colors";
import { IItemToProcess } from './interfaces/IItemToProcess';
import BigNumber from "bignumber.js";

main();

async function main() {

    const readGateway = new ReadGateway(config.gatewayUrl, config.customisationContract, config.readGatewayOptions);
    const writeGateway = new WriteGateway(config.gatewayUrl, envVariables.senderAddress, envVariables.signer);
    const customisationSC = new SmartContract({ address: config.customisationContract });
    const renderConfig = new RenderConfig(userRenderConfig, renderConfigPlugins);
    const renderer = new MyImageRenderer(renderConfig);
    const pinata = new PinataPin(envVariables.pinataApiKey, envVariables.pinataApiSecret, "pin_folder");

    await pinata.testAuthentication();
    await writeGateway.sync();
    await renderer.downloadImages({ verbose: true });

    const alreadyProcessedCID: string[] = [];

    while (true) {

        const queue = await readGateway.getToBuildQueue(renderConfig.layersOrder, renderConfig.defaultLayers);

        console.log(`\nProcessing ${queue.length} elements from the rendering queue...`)

        if (queue.length > 0) {
            const itemsPromises = queue
                .map((item) => renderer.renderAdvanced(item));

            const items = (await Promise.all(itemsPromises))
                .filter((item) => item !== undefined && alreadyProcessedCID.includes(item.cid) == false) as IItemToProcess[];

            const skippedElements = itemsPromises.length - items.length;
            if (skippedElements > 0) {
                console.log(`Skipped ${skippedElements} items because they were already processed.`.grey);
            }

            if (items.length > 0) {

                await claimIfNeeded(readGateway, writeGateway, customisationSC, config.claimThreshold);

                await Promise.all([
                    pinata.multiplePin(items),
                    writeGateway.setCid(items, customisationSC),
                ])

                for (const item of items) {
                    alreadyProcessedCID.push(item.cid);
                }
            }
        }

        await sleep(config.msBetweenUpdate)
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
