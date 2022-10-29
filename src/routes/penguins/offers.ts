import { Request, Response } from 'express';
import { penguinsCollection, itemsCollection } from '../../const';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';
import { getItemFromToken } from '../../utils/dbHelper';

export default async function getPenguinsOffers(req: Request, res: Response, networkProvider: APCNetworkProvider) {


    const offers = (await networkProvider.getOffers([penguinsCollection]));

    const response = {
        offers: offers,
        associatedItems: await networkProvider.getPenguinsFromOffers(offers)
    };

    sendSuccessfulJSON(res, response);
}