import { Address } from "@elrondnetwork/erdjs/out";
import { IConfig } from "./interfaces/IConfig";
import BigNumber from "bignumber.js";

const config: IConfig = {
    msBetweenUpdate: 500,
    gatewayUrl: "https://devnet-gateway.elrond.com",
    customisationContract: new Address("erd1qqqqqqqqqqqqqpgq4cc5y02uglu0fu2v7vkrnctc89jn2pgzsdvspx4u4x"),
    claimThreshold: new BigNumber("1e18"), // 1 EGLD
};

Object.freeze(config);

export default config;