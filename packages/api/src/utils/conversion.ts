import { IItem } from '@apcolony/marketplace-api';
import { NonFungibleTokenOfAccountOnNetwork } from '@elrondnetwork/erdjs-network-providers/out';
import { Nonce } from '@elrondnetwork/erdjs-network-providers/out/primitives';

export function toIdentifier(collection: string, nonce: number): string {
    return `${collection}-${new Nonce(nonce).hex()}`;
}