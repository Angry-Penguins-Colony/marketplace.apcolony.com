export function parseAttributes(attributes: string) {
    return attributes
        .split(";")
        .map(attribute => {
            const [slot, itemName] = attribute.split(":");

            console.log(itemName);

            return {
                slot,
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
