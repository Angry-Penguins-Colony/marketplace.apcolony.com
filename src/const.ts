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
                penguinsCount: 5555,
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

export const itemsDatabaseJson = 'src/databases/items.json';
export const ipfsGateway = "https://ipfs.io/ipfs/";

export const getItemWebThumbnail = (id: string): string => {
    return `https://apc-items.s3.eu-west-3.amazonaws.com/thumbnail_web/${id}-thumbnail-web.jpg`
};

export const getPenguinWebThumbnail = (cid: string): string => {
    return `https://apc-penguins.s3.eu-west-3.amazonaws.com/${cid}-web.jpg`;
}