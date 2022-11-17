import { Request, Response } from 'express';
import { eggsCollection, penguinsCollection } from '../../../const';
import { APCNetworkProvider } from '../../../classes/APCNetworkProvider';
import { sendSuccessfulJSON, withTryCatch } from '../../../utils/response';

export default async function getEggsOffers(req: Request, res: Response, networkProvider: APCNetworkProvider) {
    withTryCatch(res, async () => {
        const offers = (await networkProvider.getOffers([eggsCollection]));

        const response = {
            offers: offers,
            associatedItems: await networkProvider.getEggsFromOffers(offers)
        };

        sendSuccessfulJSON(res, response);
    });
}