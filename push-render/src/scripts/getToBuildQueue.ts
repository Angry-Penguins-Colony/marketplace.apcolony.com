import Bottleneck from "bottleneck";
import ReadGateway from "../classes/ReadGateway";
import config from "../config";
import { renderConfig } from "@apcolony/renderer";
import RenderAttributes from "@apcolony/renderer/dist/classes/RenderAttributes";
import Devnet from "@apcolony/db-marketplace/out/devnet";

main();


async function main() {
    const gateway = new ReadGateway(config.gatewayUrl, config.customisationContract, new Bottleneck(), Devnet.itemsDatabase);
    const queue: {
        renderAttribute: RenderAttributes;
        badgeNumber: number;
    }[] = await gateway.getToBuildQueue();


    for (const { renderAttribute, badgeNumber } of queue) {
        console.log(badgeNumber, "=>", renderAttribute.toAttributes(Devnet.itemsDatabase.items));
    }
    console.log("Found " + queue.length + " images in the queue");
}

