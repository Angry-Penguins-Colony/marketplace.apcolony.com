import Bottleneck from "bottleneck";
import ReadGateway from "../classes/ReadGateway";
import config from "../config";
import { devnetToolDeploy } from "../devnet.tool-result";
import { renderConfig } from "@apcolony/renderer";
import RenderAttributes from "@apcolony/renderer/dist/classes/RenderAttributes";

main();


async function main() {
    const gateway = new ReadGateway(config.gatewayUrl, config.customisationContract, new Bottleneck());
    const queue: {
        renderAttribute: RenderAttributes;
        badgeNumber: number;
    }[] = await gateway.getToBuildQueue();


    for (const { renderAttribute, badgeNumber } of queue) {
        console.log(badgeNumber, "=>", renderAttribute.toAttributes(devnetToolDeploy.items, renderConfig.slots));
    }
    console.log("Found " + queue.length + " images in the queue");
}

