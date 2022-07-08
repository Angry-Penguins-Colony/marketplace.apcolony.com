import { Address } from "@elrondnetwork/erdjs/out";
import { IConfig } from "./interfaces/IConfig";

const config: IConfig = {
    msBetweenUpdate: 500,
    gatewayUrl: "https://devnet-gateway.elrond.com",
    customisationContract: new Address("erd1qqqqqqqqqqqqqpgq5qpz7xdm9uvrv73qyl4250q5yeh0z6ljsdvs6mvfyy"),
};

Object.freeze(config);

export default config;