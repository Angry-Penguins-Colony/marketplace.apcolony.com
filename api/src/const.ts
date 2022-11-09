import { Address } from '@elrondnetwork/erdjs/out';
import { getNetworkType } from './env';
import devnetConfig from "@apcolony/db-marketplace/out/devnet";

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
                penguinsIdentifier: devnetConfig.penguinsIdentifier,
                penguinsCount: devnetConfig.penguinsCount,
                itemsIdentifier: devnetConfig.itemsIdentifier,
                customisationContract: Address.fromBech32(devnetConfig.customisationContractAddress),
                marketplaceContract: Address.fromBech32(devnetConfig.sellingContract),
                nftStakingContract: Address.fromBech32(devnetConfig.stakingContract),
                nftStakingToken: devnetConfig.nftStakingToken,
                originalTokensAmountInStakingSc: devnetConfig.originalTokensAmountInStakingSc,
                itemsDatabase: devnetConfig.itemsDatabase,
            };
    }
}

export const penguinsCollection = getNetworkInfos().penguinsIdentifier;
export const itemsCollection = getNetworkInfos().itemsIdentifier;
export const allCollections = [penguinsCollection, ...Object.values(itemsCollection).flat()];
export const gateway = getNetworkInfos().gateway;
export const api = getNetworkInfos().api;
export const customisationContract = getNetworkInfos().customisationContract;
export const marketplaceContract = getNetworkInfos().marketplaceContract;
export const penguinsCount = getNetworkInfos().penguinsCount;
export const nftStakingContract = getNetworkInfos().nftStakingContract;
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