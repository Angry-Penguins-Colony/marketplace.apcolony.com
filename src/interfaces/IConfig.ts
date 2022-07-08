import { IAddress } from "@elrondnetwork/erdjs/out";
import { GatewayOptions } from "../classes/Gateway";

export interface IConfig {
    msBetweenUpdate: number;
    gatewayUrl: string;
    customisationContract: IAddress;
    gatewayOptions?: GatewayOptions;
}
