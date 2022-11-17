import { ElementType } from "@apcolony/marketplace-api";

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

    if (!url) throw new Error("Cannot get CID from IPFS because url is undefined.");

    if (url.endsWith("/")) {
        url = url.substring(0, url.length - 1);
    }

    const lastSlashIndex = url.lastIndexOf("/");
    return url.substring(lastSlashIndex + 1);
}

// TODO: move to common utils (it has some tests)
export function splitCollectionAndNonce(identifier: string) {
    const splited = identifier.split('-');

    if (splited.length == 3) {
        return {
            collection: splited[0] + '-' + splited[1],
            nonce: parseInt(splited[2], 16)
        };
    } else {
        throw new Error(`Invalid identifier ${identifier}`);
    }
}

export function getIdFromPenguinName(name: string): number {

    if (!name) throw new Error("No name provided");

    const lastHashIndex = name.lastIndexOf("#");

    if (lastHashIndex == -1) throw new Error(`Invalid name ${name}`);

    const id = parseInt(name.substring(lastHashIndex + 1));

    if (isNaN(id)) throw new Error(`Invalid name ${name}`);

    return id;
}

export function getNameFromPenguinId(id: string | number): string {
    return `Penguin #${id}`;
}

export function isElementType(str: string): boolean {

    const validTypes: ElementType[] = [
        "penguins",
        "items",
        "eggs"
    ]

    return (validTypes as string[]).includes(str);
}