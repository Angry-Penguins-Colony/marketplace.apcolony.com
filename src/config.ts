import { Address, IAddress } from "@elrondnetwork/erdjs/out";
import { GatewayOptions } from "./classes/Gateway";

interface Config {
    msBetweenUpdate: number;
    gatewayUrl: string;
    customisationContract: IAddress;
    gatewayOptions?: GatewayOptions;
}

const config: Config = {
    msBetweenUpdate: 500,
    gatewayUrl: "",
    customisationContract: new Address(""),
};

Object.freeze(config);

export default config;