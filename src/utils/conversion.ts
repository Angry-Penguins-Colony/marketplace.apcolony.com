import { IItem } from '@apcolony/marketplace-api';
import { NonFungibleTokenOfAccountOnNetwork } from '@elrondnetwork/erdjs-network-providers/out';
import { Nonce } from '@elrondnetwork/erdjs-network-providers/out/primitives';
import { items, itemsCollection } from '../const';
import { extractCIDFromIPFS, removeNonceFromIdentifier } from './string';


export function getItemFromNft(nft: NonFungibleTokenOfAccountOnNetwork): IItem {

    const id = items.find(item => item.identifier === nft.identifier)?.id;

    if (!id) throw new Error(`Missing databaseId for ${nft.identifier}`);

    return {
        id: id,
        type: "items",

        identifier: nft.identifier,
        nonce: nft.nonce,
        collection: nft.collection,

        slot: getSlotFromIdentifier(nft.identifier),
        name: nft.name,
        description: "", // TODO:
        thumbnailCID: extractCIDFromIPFS(nft.assets[0]),
        renderCID: extractCIDFromIPFS(nft.assets[1]),
    }
}

export function getSlotFromIdentifier(identifier: string): string {

    const collection = removeNonceFromIdentifier(identifier);
    const foundSlot = Object.keys(itemsCollection)
        .find(key => (itemsCollection as any)[key] === collection);

    if (!foundSlot) throw new Error(`No slot found for ${identifier}`);

    return foundSlot;
}


export function toIdentifier(collection: string, nonce: number): string {
    return `${collection}-${new Nonce(nonce).hex()}`;
}