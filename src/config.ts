import { Address } from "@elrondnetwork/erdjs/out";
import { IConfig } from "./interfaces/IConfig";

const config: IConfig = {
    msBetweenUpdate: 500,
    gatewayUrl: "https://devnet-gateway.elrond.com",
    customisationContract: new Address("erd1qqqqqqqqqqqqqpgq89n8l76qp0uf4q75wamrfx8jk6dxcpe9sdvsdzt08j"),
};

Object.freeze(config);

export default config;