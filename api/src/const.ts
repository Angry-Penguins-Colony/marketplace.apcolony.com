import { getNetworkType } from './env';
import devnetConfig from "@apcolony/db-marketplace/out/devnet";
import mainnetConfig from "@apcolony/db-marketplace/out/mainnet";
import { Address } from '@elrondnetwork/erdjs/out';

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
                gateway: process.env.GATEWAY ?? "https://gateway.elrond.com",
                api: "https://api.elrond.com",
                ...mainnetConfig
            };

        case "DEVNET":
            return {
                gateway: process.env.GATEWAY ?? "https://devnet-gateway.elrond.com",
                api: "https://devnet-api.elrond.com",
                ...devnetConfig
            };
    }
}

// TODO: remove this repetitive part of code
export const penguinsCollection = getNetworkInfos().penguinsCollection;
export const itemsCollection = getNetworkInfos().itemsCollections;
export const allCollections = [penguinsCollection, ...Object.values(itemsCollection).flat()];
export const gateway = getNetworkInfos().gateway;
export const api = getNetworkInfos().api;
export const customisationContract: Address = new Address(getNetworkInfos().customisationContractAddress);
export const marketplaceContract: Address = new Address(getNetworkInfos().sellingContract);
export const penguinsCount = getNetworkInfos().penguinsCount;
export const nftStakingContract: Address = new Address(getNetworkInfos().stakingContract);
export const nftStakingToken = getNetworkInfos().nftStakingToken;
export const originalTokensAmountInStakingSc = getNetworkInfos().originalTokensAmountInStakingSc;
export const itemsDatabase = getNetworkInfos().itemsDatabase;

export const ipfsGateway = "https://ipfs.io/ipfs/";

export const getItemWebThumbnail = (id: string): string => {
    return `https://apc-items.s3.eu-west-3.amazonaws.com/thumbnail_web/${id}-thumbnail-web.jpg`
};

export const getRenderWebThumbnail = (id: string): string => {
    return `https://apc-items.s3.eu-west-3.amazonaws.com/render_web/${id}-render-web-1024x1024.png`;
}

export const getPenguinWebThumbnail = (cid: string): string => {
    return `https://apc-penguins.s3.eu-west-3.amazonaws.com/${cid}-web.jpg`;
}