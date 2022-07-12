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
import { IRenderOutput } from './interfaces/IRenderOutput';

main();

async function main() {

    const readGateway = new ReadGateway(config.gatewayUrl, config.customisationContract, config.readGatewayOptions);
    const writeGateway = new WriteGateway(config.gatewayUrl, envVariables.senderAddress, envVariables.signer);
    const customisationSC = new SmartContract({ address: config.customisationContract });
    const renderConfig = new RenderConfig(userRenderConfig, renderConfigPlugins);
    const renderer = new MyImageRenderer(renderConfig);
    const pinata = new PinataPin(envVariables.pinataApiKey, envVariables.pinataApiSecret, "pin_folder");

    await pinata.testAuthentication();
    await renderer.downloadImages({ verbose: true });

    while (true) {

        const queue = await readGateway.getToBuildQueue(renderConfig.layersOrder, renderConfig.defaultLayers);

        console.log(`\nProcessing ${queue.length} elements from the rendering queue...`)

        if (queue.length > 0) {
            const cidsPromises = queue
                .map((item) => renderer.renderAdvanced(item));

            const cids = (await Promise.all(cidsPromises))
                .filter((item) => item !== undefined) as IRenderOutput[];

            if (cids.length > 0) {

                await Promise.all([
                    pinata.multiplePin(cids),
                    writeGateway.setCid(cids, customisationSC),
                ])

                await sleep(15000);

                for (const cid of cids) {
                    console.log(`${"[ADD]".green} ${cid.cid}`);
                }
            }
        }

        await sleep(config.msBetweenUpdate)
    }
}

