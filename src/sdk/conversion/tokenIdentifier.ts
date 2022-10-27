export function splitIdentifier(identifier: string): { collection: string, nonce: number } {

    const separatorIndex = identifier.lastIndexOf('-');

    if (separatorIndex === -1) {
        throw new Error(`Invalid identifier ${identifier} missing separator.`);
    }

    const collection = identifier.substring(0, separatorIndex);
    const nonceString = identifier.substring(separatorIndex + 1);
    const nonce = parseInt(nonceString);

    if (isNaN(nonce)) {
        throw new Error(`Invalid identifier ${identifier}. Nonce "${nonceString}" is NaN`);
    }


    return { collection, nonce };
}