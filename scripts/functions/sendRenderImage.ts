import { SmartContract, StringValue, TransactionPayload } from "@elrondnetwork/erdjs/out";
import GatewayOnNetwork from "../../src/classes/GatewayOnNetwork";
import config from "../../src/config";
import RenderAttributes from "../../src/structs/RenderAttributes";
import { getSenderAddress, getSignerFromEnv } from "../../src/utils";

export async function sendRenderImage(attributes: RenderAttributes) {

    const smartContract = new SmartContract({ address: config.customisationContract });
    const gatewayOnNetwork = new GatewayOnNetwork(config.gatewayUrl, getSenderAddress());

    await gatewayOnNetwork.sync();

    const tx = smartContract.call({
        func: { name: "renderImage" },
        args: [
            new StringValue(attributes.toAttributes())
        ],
        value: "",
        gasLimit: 50_000_000,
        gasPrice: gatewayOnNetwork.networkConfig.MinGasPrice,
        chainID: gatewayOnNetwork.networkConfig.ChainID,
    });


    return gatewayOnNetwork.sendTransaction(tx, getSignerFromEnv());
}