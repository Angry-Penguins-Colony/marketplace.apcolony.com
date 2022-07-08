import { sleep } from "ts-apc-utils";
import Gateway from "./classes/Gateway";
import IRender from "./classes/IRender";
import Renderer from "./classes/Renderer";
import config from "./config";
import { CIDKvp } from "./structs/CIDKvp";
import RenderAttributes from "./structs/RenderAttributes";


main();

async function main() {
    console.log("Hello World");
    const gateway = new Gateway(config.gatewayUrl, config.customisationContract, config.gatewayOptions);

    while (true) {

        const queue = await gateway.getToBuildQueue();
        const render: IRender = new Renderer();

        const promise_cid = queue
            .map(async (item): Promise<CIDKvp> => ({
                cid: await render.getCID(item),
                attributes: item
            }));

        const cid = await Promise.all(promise_cid) as CIDKvp[];

        await gateway.setCid(cid);

        await sleep(config.msBetweenUpdate)
    }
}