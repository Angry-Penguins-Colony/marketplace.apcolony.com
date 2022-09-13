import RenderAttributes from "@apc/renderer/dist/classes/RenderAttributes";
import { UserSigner } from "@elrondnetwork/erdjs-walletcore/out";
import { Address, SmartContract, StringValue, TransactionPayload } from "@elrondnetwork/erdjs/out";
import WriteGateway from "../../classes/WriteGateway";
import config from "../../config";
import { envVariables } from "../../utils";
import "dotenv/config";
import Bottleneck from "bottleneck";

export async function sendRenderImage(attributes: RenderAttributes) {

    const smartContract = new SmartContract({ address: config.customisationContract });

    const sender = {
        address: process.env.SENDER_TEST_BECH32,
        pem: process.env.SENDER_TEST_PEM
    };

    if (!sender.address) throw new Error("Missing env SENDER_TEST_ADDRESS");
    if (!sender.pem) throw new Error("Missing env SENDER_TEST_PEM");

    console.log(`Sending render image request to ${sender.address}...`);
    const writeGateway = new WriteGateway(config.gatewayUrl, new Address(sender.address), UserSigner.fromPem(sender.pem), new Bottleneck());

    await writeGateway.sync();

    const tx = smartContract.call({
        func: { name: "renderImage" },
        args: [
            new StringValue(attributes.toAttributes())
        ],
        value: 1_000_000_000_000_000, // 0.001 EGLD
        gasLimit: 50_000_000,
        gasPrice: writeGateway.networkConfig.MinGasPrice,
        chainID: writeGateway.networkConfig.ChainID,
    });


    return writeGateway.sendTransaction(tx);
}