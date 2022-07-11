import { ApiNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";
import ReadGateway from "../src/classes/ReadGateway";
import config from "../src/config";
import { functionNames } from "../src/const";

main();


async function main() {
    const gateway = new ReadGateway(config.gatewayUrl, config.customisationContract, config.readGatewayOptions);
    const queue = await gateway.getToBuildQueue();
    console.log(queue);
}

