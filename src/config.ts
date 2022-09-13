import { Address } from "@elrondnetwork/erdjs/out";
import { IConfig } from "./interfaces/IConfig";
import BigNumber from "bignumber.js";
import { devnetToolDeploy } from "./devnet.tool-result";

const config: IConfig = {
    msBetweenUpdate: 500,
    gatewayUrl: "https://devnet-gateway.elrond.com",
    customisationContract: Address.fromBech32(devnetToolDeploy.customizationContractAddress.bech32),
    claimThreshold: new BigNumber("1e18"), // 1 EGLD
};

Object.freeze(config);

export default config;