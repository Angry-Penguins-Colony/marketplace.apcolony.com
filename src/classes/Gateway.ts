import { functionNames, officialGatewayMaxRPS } from "../const";
import { CIDKvp } from "../structs/CIDKvp";
import RenderAttributes from "../structs/RenderAttributes";
import Bottleneck from "bottleneck";
import { requestsPerMinutesToMinTime } from "../utils";
import { IAddress, IContractFunction, ISmartContract, SmartContract } from "@elrondnetwork/erdjs/out";

export interface GatewayOptions {
    readGateway?: {
        url: string;
        maxRPS: number,
        maxConcurrent: number
    }
}

export default class Gateway {

    private readonly _customisationContract: ISmartContract;

    private readonly _writeGateway: string;
    private readonly _readGateway: string;
    private readonly _readGatewayLimiter: Bottleneck;

    constructor(
        gatewayUrl: string,
        customisationContractAddress: IAddress,
        options?: GatewayOptions
    ) {

        this._customisationContract = new SmartContract({ address: customisationContractAddress });

        this._writeGateway = gatewayUrl;
        this._readGateway = options?.readGateway?.url ?? gatewayUrl;

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

    public async setCid(cid: CIDKvp[]): Promise<{
        hash: string;
        nonce: number;
    }> {
        throw new Error("Method not implemented.");
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
                    "args": []
                })
            }
        );

        return res.json();
    }
}