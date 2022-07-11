import { functionNames, officialGatewayMaxRPS } from "../const";
import RenderAttributes from "../structs/RenderAttributes";
import Bottleneck from "bottleneck";
import { requestsPerMinutesToMinTime } from "../utils";
import { IAddress, ISmartContract, SmartContract } from "@elrondnetwork/erdjs/out";
import fetch from "node-fetch";
import { IGatewayOptions } from "../interfaces/IGatewayOptions";
import { ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";


export default class ReadGateway {

    private readonly _customisationContract: ISmartContract;
    private readonly _gateway: ProxyNetworkProvider;
    private readonly _requestLimiter: Bottleneck;


    constructor(
        gatewayUrl: string,
        customisationContractAddress: IAddress,
        options?: IGatewayOptions
    ) {
        this._gateway = new ProxyNetworkProvider(gatewayUrl);

        this._customisationContract = new SmartContract({ address: customisationContractAddress });

        this._requestLimiter = new Bottleneck({
            maxConcurrent: options?.maxConcurrent ?? 1,
            minTime: requestsPerMinutesToMinTime(options?.maxRPS ?? officialGatewayMaxRPS)
        });
    }


    public async getToBuildQueue(): Promise<RenderAttributes[]> {

        // TODO: use _requestLimiter
        const output = await this._gateway.queryContract({
            address: this._customisationContract.getAddress(),
            func: {
                toString(): string {
                    return functionNames.getImagesToRender;
                }
            },
            getEncodedArguments() {
                return [];
            },
        });

        const renderAttributes = output.returnData
            .map(data => Buffer.from(data, "base64").toString())
            .map(attributes => RenderAttributes.fromAttributes(attributes));

        return renderAttributes
    }
}