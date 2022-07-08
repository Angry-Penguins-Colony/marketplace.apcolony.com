import { IAddress } from "@elrondnetwork/erdjs/out";
import { IGatewayOptions } from "./IGatewayOptions";

export interface IConfig {
    msBetweenUpdate: number;
    gatewayUrl: string;
    customisationContract: IAddress;
    gatewayOptions?: IGatewayOptions;
}
