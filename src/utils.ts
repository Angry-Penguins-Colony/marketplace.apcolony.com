import { IPenguin, Nonce } from '@apcolony/marketplace-api';
import { NonFungibleTokenOfAccountOnNetwork } from '@elrondnetwork/erdjs-network-providers/out';
import { Response } from 'express';
import { networkInterfaces } from 'os';

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

    console.log(nft.assets[0]);

    if (nft.assets[0] == undefined) {
        throw new Error(`No CID linked to the nft ${nft.identifier}`);
    }

    return {
        identifier: nft.identifier,
        name: nft.name,
        nonce: new Nonce(nft.nonce),
        score: -1,
        purchaseDate: new Date(), // TODO:
        thumbnailCID: extractCIDFromIPFS(nft.assets[0]), // TODO:
        equippedItems: {}, // TODO:
    }
}

export function extractCIDFromIPFS(url: string): string {

    if (url.endsWith("/")) {
        url = url.substring(0, url.length - 1);
    }

    const lastSlashIndex = url.lastIndexOf("/");
    return url.substring(lastSlashIndex + 1);
}