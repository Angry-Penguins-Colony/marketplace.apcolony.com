import { Address } from "@elrondnetwork/erdjs/out";
import BigNumber from "bignumber.js";
import devnetConfig from "@apcolony/db-marketplace/out/devnet"
import mainnetConfig from "@apcolony/db-marketplace/out/mainnet"
import "dotenv/config";

const CONSTANT_CONFIG = {
    msBetweenUpdate: 1_500,
    claimThreshold: new BigNumber("5e17"), // 0.5 EGLD
};

function getNetworkConfig() {

    switch (process.env.NETWORK_TYPE) {
        case "DEVNET":
            return {
                gatewayUrl: "https://devnet-gateway.multiversx.com",
                customisationContract: Address.fromBech32(devnetConfig.customisationContractAddress),
                itemsDatabase: devnetConfig.itemsDatabase
            };

        case "MAINNET":
            return {
                gatewayUrl: "https://gateway.multiversx.com",
                customisationContract: Address.fromBech32(mainnetConfig.customisationContractAddress),
                itemsDatabase: mainnetConfig.itemsDatabase
            };

        default:
            throw new Error("Invalid network type");

    }
}

const config = {
    ...getNetworkConfig(),
    ...CONSTANT_CONFIG,
}

Object.freeze(config);

export default config;
