import { functionNames, officialGatewayMaxRPS } from "../const";
import RenderAttributes from "../structs/RenderAttributes";
import Bottleneck from "bottleneck";
import { requestsPerMinutesToMinTime } from "../utils";
import { IAddress, ISmartContract, SmartContract } from "@elrondnetwork/erdjs/out";
import fetch from "node-fetch";
import { IGatewayOptions } from "../interfaces/IGatewayOptions";


export default class ReadGateway {

    private readonly _customisationContract: ISmartContract;
    private readonly _readGateway: string;
    private readonly _readGatewayLimiter: Bottleneck;


    constructor(
        gatewayUrl: string,
        customisationContractAddress: IAddress,
        options?: IGatewayOptions
    ) {

        this._readGateway = options?.readGateway?.url ?? gatewayUrl;
        this._customisationContract = new SmartContract({ address: customisationContractAddress });

        this._readGatewayLimiter = new Bottleneck({
            maxConcurrent: options?.readGateway?.maxConcurrent ?? 1,
            minTime: requestsPerMinutesToMinTime(options?.readGateway?.maxRPS ?? officialGatewayMaxRPS)
        });
    }


    public async getToBuildQueue(): Promise<RenderAttributes[]> {

        const json = await this.query(this._customisationContract.getAddress(), functionNames.getImagesToRender);
        console.log(json.data);

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