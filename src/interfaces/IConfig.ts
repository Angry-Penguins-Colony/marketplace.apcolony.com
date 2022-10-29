import { IAddress } from "@elrondnetwork/erdjs/out";
import BigNumber from "bignumber.js";

export interface IConfig {
    msBetweenUpdate: number;
    gatewayUrl: string;
    customisationContract: IAddress;
    claimThreshold: BigNumber;
}
