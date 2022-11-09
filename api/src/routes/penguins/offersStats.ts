import { Request, Response } from 'express';
import { penguinsCollection, itemsCollection } from '../../const';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON, withTryCatch } from '../../utils/response';

export default async function getPenguinsOffersStats(req: Request, res: Response, networkProvider: APCNetworkProvider) {

    withTryCatch(res, async () => {


        const marketData = (await networkProvider.getMarketData([penguinsCollection]));

        sendSuccessfulJSON(res, marketData);
    });
}