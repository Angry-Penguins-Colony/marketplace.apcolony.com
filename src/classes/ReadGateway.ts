import { functionNames } from "../const";
import Bottleneck from "bottleneck";
import { IAddress, ISmartContract, SmartContract } from "@elrondnetwork/erdjs/out";
import { ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";
import RenderAttributes from "@apcolony/renderer/dist/classes/RenderAttributes";
import BigNumber from "bignumber.js";
import { devnetToolDeploy } from "../devnet.tool-result";


export default class ReadGateway {

    private readonly _customisationContract: ISmartContract;
    private readonly _gateway: ProxyNetworkProvider;
    private readonly _requestLimiter: Bottleneck;


    constructor(
        gatewayUrl: string,
        customisationContractAddress: IAddress,
        requestLimiter: Bottleneck
    ) {
        this._gateway = new ProxyNetworkProvider(gatewayUrl);
        this._customisationContract = new SmartContract({ address: customisationContractAddress });
        this._requestLimiter = requestLimiter;
    }


    public async getToBuildQueue(
        layersOrder: string[]
    ): Promise<RenderAttributes[]> {

        const output = await this._requestLimiter.schedule(this._gateway.queryContract.bind(this._gateway), {
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
            .map(attributes => RenderAttributes.fromAttributes(attributes, devnetToolDeploy.items, layersOrder));

        return renderAttributes
    }

    public async getBalance(address: IAddress): Promise<BigNumber> {
        let account = await this._requestLimiter.schedule(this._gateway.getAccount.bind(this._gateway), address);
        return account.balance;
    }
}