import { functionNames, officialGatewayMaxRPS } from "../const";
import { CIDKvp } from "../structs/CIDKvp";
import RenderAttributes from "../structs/RenderAttributes";
import Bottleneck from "bottleneck";
import { requestsPerMinutesToMinTime } from "../utils";
import { IAddress, IContractFunction, ISmartContract, SmartContract, StringValue, Transaction, TransactionPayload } from "@elrondnetwork/erdjs/out";
import fetch from "node-fetch";
import GatewayOnNetwork from "./GatewayOnNetwork";
import { ISigner } from "@elrondnetwork/erdjs-walletcore/out/interface";
import { INetworkProvider } from "@elrondnetwork/erdjs-network-providers/out/interface";
import { ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";


interface TransactionResult {
    nonce: number;
    hash: string;
}

export interface GatewayOptions {
    readGateway?: {
        url: string;
        maxRPS: number,
        maxConcurrent: number
    }
}

export default class Gateway {

    private readonly _customisationContract: ISmartContract;
    private readonly _signer: ISigner;
    private readonly _networkProvider: INetworkProvider;
    private readonly _readGateway: string;
    private readonly _readGatewayLimiter: Bottleneck;

    private readonly _gatewayOnNetwork: GatewayOnNetwork;


    constructor(
        gatewayUrl: string,
        customisationContractAddress: IAddress,
        signer: ISigner,
        options?: GatewayOptions
    ) {

        this._readGateway = options?.readGateway?.url ?? gatewayUrl;
        this._signer = signer;

        this._networkProvider = new ProxyNetworkProvider(gatewayUrl, {
            timeout: 60000
        });
        this._customisationContract = new SmartContract({ address: customisationContractAddress });
        this._gatewayOnNetwork = new GatewayOnNetwork(this._networkProvider);



        this._readGatewayLimiter = new Bottleneck({
            maxConcurrent: options?.readGateway?.maxConcurrent ?? 1,
            minTime: requestsPerMinutesToMinTime(options?.readGateway?.maxRPS ?? officialGatewayMaxRPS)
        });
    }


    public async getToBuildQueue(): Promise<RenderAttributes[]> {

        const json = await this.query(this._customisationContract.getAddress(), functionNames.getImagesToRender);
        const data = json.data.data;

        console.log(data);

        throw new Error("Method not implemented.");
    }

    public async setCid(cid: CIDKvp[]): Promise<TransactionResult> {
        if (cid.length == 0) throw new Error("No CID to send");

        await this._gatewayOnNetwork.sync();

        const func = { name: "setCidOf" };
        const args = cid
            .flatMap(({ cid, attributes }) => [
                new StringValue(attributes.toAttributes()),
                new StringValue(cid)
            ]);

        let payload = TransactionPayload.contractCall()
            .setFunction(func)
            .setArgs(args)
            .build();

        const tx = this._customisationContract.call({
            func: func,
            args: args,
            value: "",
            gasLimit: (cid.length * 7_000_000) + payload.length() * 1500,
            gasPrice: this._gatewayOnNetwork.networkConfig.MinGasPrice,
            chainID: this._gatewayOnNetwork.networkConfig.ChainID,
        });

        return this.sendTransaction(tx);
    }

    private async sendTransaction(tx: Transaction): Promise<TransactionResult> {
        await this._gatewayOnNetwork.sync();

        const nonce = this._gatewayOnNetwork.nonce;
        tx.setNonce(nonce);
        this._gatewayOnNetwork.incrementNonce();

        await this._signer.sign(tx);

        const hash = await this._networkProvider.sendTransaction(tx);

        return { hash, nonce };
    }

    private async query(address: IAddress, funcName: string, args: [] = []) {
        const res = await this._readGatewayLimiter.schedule(
            fetch,
            this._readGateway + "/vm-values/string",
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "scAddress": address.bech32(),
                    "funcName": funcName,
                    "args": args
                })
            }
        );

        const json = await res.json();

        if (json.data == null) {

            console.log(json);
            throw new Error("No data returned from the gateway. Got error message: " + json.error);
        }

        return json;
    }
}