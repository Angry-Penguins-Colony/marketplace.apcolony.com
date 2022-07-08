import { sleep } from "ts-apc-utils";
import Gateway from "./classes/Gateway";
import IRender from "./interfaces/IRender";
import Renderer from "./classes/Renderer";
import config from "./config";
import { CIDKvp } from "./structs/CIDKvp";
import { UserSigner } from "@elrondnetwork/erdjs-walletcore/out";
import 'dotenv/config'

main();

async function main() {
    console.log("Hello World");
    const gateway = new Gateway(config.gatewayUrl, config.customisationContract, UserSigner.fromPem(process.env.CID_PEM ?? ""), config.gatewayOptions);

    while (true) {

        const queue = await gateway.getToBuildQueue();

        console.log(`Processing ${queue.length} elements fromm the rendering queue...`)

        if (queue.length > 0) {
            const render: IRender = new Renderer();

            const promise_cid = queue
                .map(async (item): Promise<CIDKvp> => ({
                    cid: await render.getCID(item),
                    attributes: item
                }));

            const cid = await Promise.all(promise_cid) as CIDKvp[];

            await gateway.setCid(cid);
        }

        await sleep(config.msBetweenUpdate)
    }
}