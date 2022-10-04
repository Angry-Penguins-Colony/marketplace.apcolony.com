import { IPenguin, IItem, IEgg } from '@apcolony/marketplace-api/out';
import { Address } from '@elrondnetwork/erdjs/out';
import { devnetToolDeploy } from './devnet.tool-result';
import { getNetworkType } from './env';

function getNetworkInfos() {

    if (process.env.GATEWAY) {
        // throw error if last character of gateway is a slash
        if (process.env.GATEWAY[process.env.GATEWAY.length - 1] === '/') {
            throw new Error(`Gateway should not end with a slash.`);
        }
    }

    switch (getNetworkType()) {
        case "MAINNET":
            throw new Error("Mainnet is not supported yet");

        case "DEVNET":
            return {
                gateway: process.env.GATEWAY ?? "https://devnet-gateway.elrond.com",
                api: "https://devnet-api.elrond.com",
                penguinsIdentifier: devnetToolDeploy.penguinsIdentifier,
                penguinsCount: devnetToolDeploy.penguinsCount,
                itemsIdentifier: devnetToolDeploy.itemsIdentifier,
                items: devnetToolDeploy.items,
                customisationContract: Address.fromBech32(devnetToolDeploy.customizationContractAddress.bech32),
                marketplaceContract: Address.fromBech32("erd1qqqqqqqqqqqqqpgqffweul9250tqr4vuf04zxdcpjdy82yvpv4xq4uha83"),
            };
    }
}

export const penguinsCollection = getNetworkInfos().penguinsIdentifier;
export const itemsCollection = getNetworkInfos().itemsIdentifier;
export const items = getNetworkInfos().items;
export const gateway = getNetworkInfos().gateway;
export const api = getNetworkInfos().api;
export const customisationContract = getNetworkInfos().customisationContract;
export const marketplaceContract = getNetworkInfos().marketplaceContract;
export const penguinsCount = getNetworkInfos().penguinsCount;