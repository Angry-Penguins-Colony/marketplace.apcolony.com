import { sleep } from "ts-apc-utils";
import ReadGateway from "./classes/ReadGateway";
import config from "./config";
import { CIDKvp } from "./structs/CIDKvp";
import 'dotenv/config'
import WriteGateway from "./classes/WriteGateway";
import { envVariables } from "./utils";
import { SmartContract } from "@elrondnetwork/erdjs/out";
import { userConfig } from "./config/render.config";
import Config from "@apc/renderer/dist/classes/config";
import { userPlugins } from "./config/render.plugins.config";
import MyImageRenderer from "./classes/MyImageRenderer";

main();

async function main() {

    const readGateway = new ReadGateway(config.gatewayUrl, config.customisationContract, config.readGatewayOptions);
    const writeGateway = new WriteGateway(config.gatewayUrl, envVariables.senderAddress, envVariables.signer);
    const customisationSC = new SmartContract({ address: config.customisationContract });
    const renderer = new MyImageRenderer(new Config(userConfig, userPlugins));

    await renderer.downloadImages({ verbose: true });

    while (true) {

        const queue = await readGateway.getToBuildQueue();

        console.log(`Processing ${queue.length} elements from the rendering queue...`)

        if (queue.length > 0) {
            const cidPromises = queue
                .map((item) => renderer.buildCidKvp(item));

            const cid = (await Promise.all(cidPromises))
                .filter((item) => item !== undefined) as CIDKvp[];

            if (cid.length > 0) {
                await writeGateway.setCid(cid, customisationSC);
            }

            // TODO: pin on ipfs
        }

        await sleep(config.msBetweenUpdate)

        console.log(""); // jump a line
    }
}

