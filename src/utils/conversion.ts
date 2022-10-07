import { IItem } from '@apcolony/marketplace-api';
import { NonFungibleTokenOfAccountOnNetwork } from '@elrondnetwork/erdjs-network-providers/out';
import { Nonce } from '@elrondnetwork/erdjs-network-providers/out/primitives';
import { items, itemsCollection } from '../const';
import { extractCIDFromIPFS, removeNonceFromIdentifier } from './string';

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