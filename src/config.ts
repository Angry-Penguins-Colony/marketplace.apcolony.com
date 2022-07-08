import { Address } from "@elrondnetwork/erdjs/out";
import { IConfig } from "./interfaces/IConfig";

const config: IConfig = {
    msBetweenUpdate: 500,
    gatewayUrl: "https://devnet-gateway.elrond.com",
    customisationContract: new Address("erd1qqqqqqqqqqqqqpgqrj36k8cswntc0e5uce7dkn2tcxsfex60sdvs2qgwf2"),
};

Object.freeze(config);

export default config;