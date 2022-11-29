export function toIdentifier(collection: string, nonce: number): string {
    return `${collection}-${numberToHex(nonce)}`;
}

export function numberToHex(n: number): string {
    let hex = n.toString(16);

    if (hex.length % 2 !== 0) {
        hex = '0' + hex;
    }

    return hex;
}