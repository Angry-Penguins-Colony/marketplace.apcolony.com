import { Request, Response } from 'express';
import { penguinsCollection } from '../../const';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';

export default async function getPenguinsOffers(req: Request, res: Response, networkProvider: APCNetworkProvider) {


    try {

        const offers = (await networkProvider.getOffers([penguinsCollection]));

        const response = {
            offers: offers,
            associatedItems: await networkProvider.getPenguinsFromOffers(offers)
        };

        sendSuccessfulJSON(res, response);
    }
    catch (e: any) {
        console.trace(e);
        res.status(500).send(e.toString())
    }
}