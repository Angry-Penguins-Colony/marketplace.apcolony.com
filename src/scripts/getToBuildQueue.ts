import RenderConfig from "@apc/renderer/dist/classes/RenderConfig";
import { ApiNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";
import Bottleneck from "bottleneck";
import ReadGateway from "../classes/ReadGateway";
import config from "../config";
import { userRenderConfig } from "../src/config/render.config";
import { renderConfigPlugins } from "../src/config/render.plugins.config";
import { functionNames } from "../const";

main();


async function main() {
    const gateway = new ReadGateway(config.gatewayUrl, config.customisationContract, new Bottleneck());
    const queue = await gateway.getToBuildQueue([]);
    console.log(queue);
}

