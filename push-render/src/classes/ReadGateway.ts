import { functionNames } from "../const";
import Bottleneck from "bottleneck";
import { IAddress, ISmartContract, SmartContract } from "@elrondnetwork/erdjs/out";
import { ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";
import RenderAttributes from "@apcolony/renderer/dist/classes/RenderAttributes";
import BigNumber from "bignumber.js";
import ItemsDatabase from "@apcolony/db-marketplace/out/ItemsDatabase";

export default class ReadGateway {

    private readonly _customisationContract: ISmartContract;
    private readonly _gateway: ProxyNetworkProvider;
    private readonly _requestLimiter: Bottleneck;
    private readonly _itemsDatabase: ItemsDatabase;


    constructor(
        gatewayUrl: string,
        customisationContractAddress: IAddress,
        requestLimiter: Bottleneck,
        itemsDatabase: ItemsDatabase
    ) {
        this._gateway = new ProxyNetworkProvider(gatewayUrl);
        this._customisationContract = new SmartContract({ address: customisationContractAddress });
        this._requestLimiter = requestLimiter;
        this._itemsDatabase = itemsDatabase;
    }


    public async getToBuildQueue() {

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

        const rawAttributes = output.returnData;
        const renderAttributes: RenderAttributes[] = [];

        for (var i = 0; i < rawAttributes.length; i += 2) {
            const attributes = Buffer.from(rawAttributes[i], "base64").toString();
            const name = Buffer.from(rawAttributes[i + 1], "base64").toString();
            const badgeNumber = parseInt(name.slice(name.lastIndexOf("#") + 1));

            if (!isBadgeNumberValid(badgeNumber)) continue;

            try {
                const renderAttribute = RenderAttributes.fromAttributes(attributes, badgeNumber, this._itemsDatabase.items);
                renderAttributes.push(renderAttribute);
            }
            catch (e) {
                console.error("Cannot build attributes because :", e);
            }
        }

        return renderAttributes;
    }

    public async getBalance(address: IAddress): Promise<BigNumber> {
        let account = await this._requestLimiter.schedule(this._gateway.getAccount.bind(this._gateway), address);
        return account.balance;
    }
}

function isBadgeNumberValid(badgeNumber: number) {
    return isNaN(badgeNumber) == false && badgeNumber > 0 && badgeNumber <= 5555;
}