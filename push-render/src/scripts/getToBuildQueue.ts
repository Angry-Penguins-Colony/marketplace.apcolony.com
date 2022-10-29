import Bottleneck from "bottleneck";
import ReadGateway from "../classes/ReadGateway";
import config from "../config";
import { devnetToolDeploy } from "../devnet.tool-result";
import { renderConfig } from "@apcolony/renderer";

main();


async function main() {
    const gateway = new ReadGateway(config.gatewayUrl, config.customisationContract, new Bottleneck());
    const queue = await gateway.getToBuildQueue([]);

    console.log(queue.map(a => a.toAttributes(devnetToolDeploy.items, renderConfig.slots)));
    console.log("Found " + queue.length + " images in the queue");
}

