import RenderAttributes from "@apcolony/renderer/dist/classes/RenderAttributes";
import { UserSigner } from "@elrondnetwork/erdjs-walletcore/out";
import { Address, SmartContract, StringValue, TransactionPayload } from "@elrondnetwork/erdjs/out";
import WriteGateway from "../../classes/WriteGateway";
import config from "../../config";
import { envVariables } from "../../utils";
import "dotenv/config";
import Bottleneck from "bottleneck";
import { devnetToolDeploy } from "../../devnet.tool-result";
import { renderConfig } from "@apcolony/renderer";

export async function sendRenderImage(attributes: RenderAttributes, writeGateway: WriteGateway) {
    const smartContract = new SmartContract({ address: config.customisationContract });

    const tx = smartContract.call({
        func: { name: "renderImage" },
        args: [
            new StringValue(attributes.toAttributes(devnetToolDeploy.items, renderConfig.slots))
        ],
        value: 1_000_000_000_000_000, // 0.001 EGLD
        gasLimit: 600_000_000,
        gasPrice: writeGateway.networkConfig.MinGasPrice,
        chainID: writeGateway.networkConfig.ChainID,
    });

    return writeGateway.sendTransaction(tx);
}

