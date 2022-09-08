import { IItem } from '@apcolony/marketplace-api';
import { NonFungibleTokenOfAccountOnNetwork } from '@elrondnetwork/erdjs-network-providers/out';
import { itemsCollection } from '../const';
import { extractCIDFromIPFS, removeNonceFromIdentifier } from './string';


export function getItemFromNft(nft: NonFungibleTokenOfAccountOnNetwork): IItem {

    return {
        identifier: nft.identifier,
        nonce: nft.nonce,
        slot: getSlotFromIdentifier(nft.identifier),
        name: nft.name,
        description: "", // TODO:
        thumbnailCID: extractCIDFromIPFS(nft.assets[0]),
        renderCID: extractCIDFromIPFS(nft.assets[1]),
        amount: nft.supply.toNumber(),
    }
}

export function getSlotFromIdentifier(identifier: string): string {

    const collection = removeNonceFromIdentifier(identifier);
    const foundSlot = Object.keys(itemsCollection)
        .find(key => (itemsCollection as any)[key] === collection);

    if (!foundSlot) throw new Error(`No slot found for ${identifier}`);

    return foundSlot;
}
