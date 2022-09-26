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
            return {
                penguinsIdentifier: 'APC-928458',
                gateway: process.env.GATEWAY ?? "https://gateway.elrond.com",
                api: "https://api.elrond.com",
                itemsIdentifier: {
                    "background": "",
                    "beak": "",
                    "clothes": "",
                    "eyes": "",
                    "hat": "",
                    "skin": "",
                    "weapon": ""
                },
                items: [],
                customisationContract: new Address(""),
            };

        case "DEVNET":
            return {
                gateway: process.env.GATEWAY ?? "https://devnet-gateway.elrond.com",
                api: "https://devnet-api.elrond.com",
                penguinsIdentifier: devnetToolDeploy.penguinsIdentifier,
                itemsIdentifier: devnetToolDeploy.itemsIdentifier,
                items: devnetToolDeploy.items,
                customisationContract: Address.fromBech32(devnetToolDeploy.customizationContractAddress.bech32),
                marketplaceContract: Address.fromBech32("erd1qqqqqqqqqqqqqpgq7dpna9wwv2yn5ukqlwgv3s0zmaxwnexpv4xq56xty9"),
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