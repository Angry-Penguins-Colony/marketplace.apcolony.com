import { IAddress } from "@elrondnetwork/erdjs/out";
import { IGatewayOptions } from "./IGatewayOptions";
import BigNumber from "bignumber.js";

export interface IConfig {
    msBetweenUpdate: number;
    gatewayUrl: string;
    customisationContract: IAddress;
    claimThreshold: BigNumber;
    readGatewayOptions?: IGatewayOptions;
}
