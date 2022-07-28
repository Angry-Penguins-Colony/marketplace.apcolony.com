import { IPenguin, Nonce } from '@apcolony/marketplace-api';
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

    console.log(nft.assets);

    return {
        identifier: nft.identifier,
        name: nft.name,
        nonce: new Nonce(nft.nonce),
        score: -1,
        purchaseDate: new Date(), // TODO:
        thumbnailCID: "", // TODO:
        equippedItems: {}, // TODO:
    }
}