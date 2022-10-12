import { stringIsFloat } from '@elrondnetwork/dapp-core/utils';

export function splitIdentifier(identifier: string): { collection: string, nonce: number } {

    const separatorIndex = identifier.lastIndexOf('-');

    if (separatorIndex === -1) {
        throw new Error(`Invalid identifier: ${identifier}`);
    }

    const collection = identifier.substring(0, separatorIndex);
    const nonceString = identifier.substring(separatorIndex + 1);

    if (stringIsFloat(nonceString)) {
        throw new Error(`Invalid identifier: ${identifier}`);
    }

    const nonce = parseInt(nonceString);

    return { collection, nonce };
}