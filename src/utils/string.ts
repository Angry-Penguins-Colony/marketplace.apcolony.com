export function parseAttributes(attributes: string) {
    return attributes
        .split(";")
        .map(attribute => {
            const [slot, itemName] = attribute.split(":");

            return {
                slot: slot.toLowerCase(),
                itemName
            };
        });
}

export function extractCIDFromIPFS(url: string): string {

    if (url.endsWith("/")) {
        url = url.substring(0, url.length - 1);
    }

    const lastSlashIndex = url.lastIndexOf("/");
    return url.substring(lastSlashIndex + 1);
}

export function removeNonceFromIdentifier(identifier: string): string {
    const splited = identifier.split('-');

    if (splited.length == 3) {
        return splited[0] + '-' + splited[1];
    }
    else if (splited.length == 2) {
        return identifier;
    } else {
        throw new Error(`Invalid identifier ${identifier}`);
    }
}


export function splitCollectionAndNonce(identifier: string) {
    const splited = identifier.split('-');

    if (splited.length == 3) {
        return {
            collection: splited[0] + '-' + splited[1],
            nonce: parseInt(splited[2])
        };
    } else {
        throw new Error(`Invalid identifier ${identifier}`);
    }
}