import { Address } from "@elrondnetwork/erdjs/out";
import { IConfig } from "./interfaces/IConfig";

const config: IConfig = {
    msBetweenUpdate: 500,
    gatewayUrl: "https://devnet-gateway.elrond.com",
    customisationContract: new Address("erd1qqqqqqqqqqqqqpgqvrc6q6nwcxvw7nrzsqmldxa34dgr6a9dsdvsdpj7gq"),
};

Object.freeze(config);

export default config;