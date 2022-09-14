import Bottleneck from "bottleneck";
import ReadGateway from "../classes/ReadGateway";
import config from "../config";

main();


async function main() {
    const gateway = new ReadGateway(config.gatewayUrl, config.customisationContract, new Bottleneck());
    const queue = await gateway.getToBuildQueue([]);
    console.log(queue);
}

