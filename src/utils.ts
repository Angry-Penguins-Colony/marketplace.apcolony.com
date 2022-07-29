import { IItem, IPenguin, Nonce } from '@apcolony/marketplace-api';
import { NonFungibleTokenOfAccountOnNetwork } from '@elrondnetwork/erdjs-network-providers/out';
import { Response } from 'express';

export function sendSuccessfulJSON(response: Response, data: any) {
    response
        .setHeader('Access-Control-Allow-Origin', '*')
        .status(200)
        .json({
            code: "successful",
            data: data
        });
}

export function getPenguinFromNft(nft: NonFungibleTokenOfAccountOnNetwork): IPenguin {

    if (nft.assets[0] == undefined) {
        throw new Error(`No CID linked to the nft ${nft.identifier}`);
    }

    return {
        identifier: nft.identifier,
        name: nft.name,
        nonce: new Nonce(nft.nonce),
        score: -1,
        purchaseDate: new Date(), // TODO:
        thumbnailCID: extractCIDFromIPFS(nft.assets[0]),
        equippedItems: getEquippedItemsFromAttributes(nft.attributes),
    }
}

export function getEquippedItemsFromAttributes(bufferAttributes: Buffer): { [key: string]: IItem } {

    const attributesKvp = bufferAttributes.toString()
        .split(";")
        .map(attribute => {
            const [slot, itemName] = attribute.split(":");
            return {
                slot,
                itemName
            }
        });

    let attributes = {} as { [key: string]: IItem };

    for (const kvp of attributesKvp) {
        attributes[kvp.slot] = getItemFromName(kvp.itemName);
    }

    return {};
    // return attributes;
}

// TODO: 
export function getItemFromName(name: string): IItem {

    // 1. Slot+Name to identifier
    // 2. get info from blockchain w/ identifier

    return {
        identifier: "", //TODO:
        nonce: new Nonce(0), //TODO:
        slot: "", // TODO:
        name: name,
        description: "", //TODO:
        thumbnailCID: "", //TODO:
    }
}

export function extractCIDFromIPFS(url: string): string {

    if (url.endsWith("/")) {
        url = url.substring(0, url.length - 1);
    }

    const lastSlashIndex = url.lastIndexOf("/");
    return url.substring(lastSlashIndex + 1);
}