import { sleep } from "ts-apc-utils";
import ReadGateway from "./classes/ReadGateway";
import IRender from "./interfaces/IRender";
import Renderer from "./classes/Renderer";
import config from "./config";
import { CIDKvp } from "./structs/CIDKvp";
import 'dotenv/config'
import WriteGateway from "./classes/WriteGateway";
import { envVariables } from "./utils";
import { SmartContract } from "@elrondnetwork/erdjs/out";

main();

async function main() {

    const readGateway = new ReadGateway(config.gatewayUrl, config.customisationContract, config.readGatewayOptions);
    const writeGateway = new WriteGateway(config.gatewayUrl, envVariables.senderAddress, envVariables.signer);
    const customisationSC = new SmartContract({ address: config.customisationContract });

    while (true) {

        const queue = await readGateway.getToBuildQueue();

        console.log(`Processing ${queue.length} elements from the rendering queue...`)

        if (queue.length > 0) {
            const render: IRender = new Renderer();

            const promise_cid = queue
                .map(async (item): Promise<CIDKvp> => ({
                    cid: await render.getCID(item),
                    attributes: item
                }));

            const cid = await Promise.all(promise_cid) as CIDKvp[];

            await writeGateway.setCid(cid, customisationSC);
        }

        await sleep(config.msBetweenUpdate)
    }
}