import { Nonce } from '@elrondnetwork/erdjs-network-providers/out/primitives';

export function toIdentifier(collection: string, nonce: number): string {
    return `${collection}-${new Nonce(nonce).hex()}`;
}