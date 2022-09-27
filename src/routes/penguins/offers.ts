import { Request, Response } from 'express';
import { penguinsCollection, itemsCollection } from '../../const';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';
import { getItemFromToken } from '../../utils/dbHelper';

export default async function getPenguinsOffers(req: Request, res: Response, networkProvider: APCNetworkProvider) {

    const collectionId = penguinsCollection;

    if (collectionId) {
        const offers = (await networkProvider.getOffers(collectionId));

        const response = {
            offers: offers
                .map(o => {
                    return {
                        ...o,
                        ["price"]: o.price.toString(),
                    }
                }),
            associatedItems: await Promise.all(offers
                .map(async (o) => networkProvider.getPenguinFromNft(await networkProvider.getNft(o.collection, o.nonce))))
        };

        sendSuccessfulJSON(res, response);
    }
}