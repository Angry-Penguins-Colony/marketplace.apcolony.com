import { EggTier, ElementType, RenderStatus } from './type';

type Price = string;


/**
 * A element that can be either an item or a penguin
 */
export interface IGenericElement {
    id: string;
    type: ElementType;

    displayName: string;
    thumbnailUrls: {
        /**
         * 1024x1204px
         */
        high: string;
        /**
         * 512x512px
         */
        small: string;
    };

    /**
     * The collection + nonce; eg. HAT-a1a1a1-01
     */
    identifier: string;
    collection: string;
    nonce: number;
}

export interface IItem extends IGenericElement {
    slot: string,
    description: string,
    renderUrls: {
        ipfs: string;
        high: string;
    };
    supply: number;
    attributeName: string
    stakePoints: number;
}

export interface IOwnedItem extends IItem {
    ownedAmount: number;
}

export interface IPenguin extends IGenericElement {

    equippedItems: { [key: string]: IItem; },
    owner?: string,
}

export interface IEgg extends IGenericElement {
    tier: EggTier,
    supply: number
}

export interface IOwnedEgg extends IEgg {
    ownedAmount: number;
}

export interface IAddress {
    hex(): string;
    bech32(): string;
    pubkey(): Buffer;
}

export interface IAttributesStatus {
    cid?: string;
    renderStatus: RenderStatus;
}

export interface IActivity {
    txHash: string;
    price: Price;
    seller: string;
    buyer: string;
    date: number;
}

export interface IOffer {

    id: number;
    price: Price;
    collection: string;
    nonce: number;
    seller: string;
}

export interface IMarketData {
    floorPrice: Price;
    totalVolume: string;
    averagePrice: Price;
    totalListed: number;
}