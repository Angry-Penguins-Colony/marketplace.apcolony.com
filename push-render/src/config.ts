import { Address } from "@elrondnetwork/erdjs/out";
import BigNumber from "bignumber.js";
import devnetConfig from "@apcolony/db-marketplace/out/devnet"
import "dotenv/config";

if (!process.env.ELROND_GATEWAY) throw new Error("ELROND_GATEWAY is not set");

const config = {
    msBetweenUpdate: 500,
    gatewayUrl: process.env.ELROND_GATEWAY,
    customisationContract: Address.fromBech32(devnetConfig.customisationContractAddress),
    claimThreshold: new BigNumber("1e18"), // 1 EGLD
    itemsDatabase: devnetConfig.itemsDatabase
};

Object.freeze(config);

export default config;