import { Address } from "@elrondnetwork/erdjs/out";
import { IConfig } from "./interfaces/IConfig";

const config: IConfig = {
    msBetweenUpdate: 500,
    gatewayUrl: "https://devnet-gateway.elrond.com",
    customisationContract: new Address("erd1qqqqqqqqqqqqqpgq4cc5y02uglu0fu2v7vkrnctc89jn2pgzsdvspx4u4x"),
};

Object.freeze(config);

export default config;