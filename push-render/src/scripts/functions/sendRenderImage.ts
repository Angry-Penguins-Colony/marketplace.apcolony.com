import RenderAttributes from "@apcolony/renderer/dist/classes/RenderAttributes";
import { UserSigner } from "@elrondnetwork/erdjs-walletcore/out";
import { Address, SmartContract, StringValue, TransactionPayload } from "@elrondnetwork/erdjs/out";
import WriteGateway from "../../classes/WriteGateway";
import config from "../../config";
import "dotenv/config";
import { renderConfig } from "@apcolony/renderer";
import ItemsDatabase from "@apcolony/db-marketplace/out/ItemsDatabase";

export async function sendRenderImage(attributes: RenderAttributes, writeGateway: WriteGateway) {
    const smartContract = new SmartContract({ address: config.customisationContract });

    const tx = smartContract.call({
        func: { name: "renderImage" },
        args: [
            new StringValue(attributes.toAttributes(config.itemsDatabase.items, renderConfig.slots))
        ],
        value: 1_000_000_000_000_000, // 0.001 EGLD
        gasLimit: 600_000_000,
        gasPrice: writeGateway.networkConfig.MinGasPrice,
        chainID: writeGateway.networkConfig.ChainID,
    });

    return writeGateway.sendTransaction(tx);
}

