import Bottleneck from "bottleneck";
import ReadGateway from "../classes/ReadGateway";
import config from "../config";
import { renderConfig } from "@apcolony/renderer";
import RenderAttributes from "@apcolony/renderer/dist/classes/RenderAttributes";
import Devnet from "@apcolony/db-marketplace/out/devnet";

main();


async function main() {
    const gateway = new ReadGateway(config.gatewayUrl, config.customisationContract, new Bottleneck(), Devnet.itemsDatabase);
    const queue = await gateway.getToBuildQueue();


    for (const renderAttribute of queue) {
        console.log(renderAttribute.badgeNumber, "=>", renderAttribute.toAttributes(Devnet.itemsDatabase.items));
    }
    console.log("Found " + queue.length + " images in the queue");
}

