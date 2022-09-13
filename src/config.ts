import { Address } from "@elrondnetwork/erdjs/out";
import { IConfig } from "./interfaces/IConfig";
import BigNumber from "bignumber.js";
import { devnetToolDeploy } from "./devnet.tool-result";

if (!process.env.ELROND_GATEWAY) throw new Error("ELROND_GATEWAY is not set");

const config: IConfig = {
    msBetweenUpdate: 500,
    gatewayUrl: process.env.ELROND_GATEWAY,
    customisationContract: Address.fromBech32(devnetToolDeploy.customizationContractAddress.bech32),
    claimThreshold: new BigNumber("1e18"), // 1 EGLD
};

Object.freeze(config);

export default config;