import RenderAttributes from "@apc/renderer/dist/classes/RenderAttributes";
import { SmartContract, StringValue, TransactionPayload } from "@elrondnetwork/erdjs/out";
import WriteGateway from "../../src/classes/WriteGateway";
import config from "../../src/config";
import { envVariables } from "../../src/utils";

export async function sendRenderImage(attributes: RenderAttributes) {

    const smartContract = new SmartContract({ address: config.customisationContract });
    const gatewayOnNetwork = new WriteGateway(config.gatewayUrl, envVariables.senderAddress, envVariables.signer);

    await gatewayOnNetwork.sync();

    const tx = smartContract.call({
        func: { name: "renderImage" },
        args: [
            new StringValue(attributes.toAttributes())
        ],
        value: 1_000_000_000_000_000, // 0.001 EGLD
        gasLimit: 50_000_000,
        gasPrice: gatewayOnNetwork.networkConfig.MinGasPrice,
        chainID: gatewayOnNetwork.networkConfig.ChainID,
    });


    return gatewayOnNetwork.sendTransaction(tx);
}