import 'dotenv/config'
import { sleep } from "ts-apc-utils";
import ReadGateway from "./classes/ReadGateway";
import config from "./config";
import { CIDKvp } from "./structs/CIDKvp";
import WriteGateway from "./classes/WriteGateway";
import { envVariables } from "./utils";
import { SmartContract } from "@elrondnetwork/erdjs/out";
import { userRenderConfig } from "./config/render.config";
import RenderConfig from "@apc/renderer/dist/classes/RenderConfig";
import { renderConfigPlugins } from "./config/render.plugins.config";
import MyImageRenderer from "./classes/MyImageRenderer";
import { PinataPin } from './classes/PinataPin';
import colors from "colors";
import { IItemToProcess } from './interfaces/IItemToProcess';

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

