import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../../classes/APCNetworkProvider';
import { penguinsCollection } from '../../../const';
import { withTryCatch, sendSuccessfulJSON } from '../../../utils/response';

export default async function getPenguinsOffersStats(req: Request, res: Response, networkProvider: APCNetworkProvider) {

    withTryCatch(res, async () => {


        const marketData = (await networkProvider.getMarketData([penguinsCollection]));

        sendSuccessfulJSON(res, marketData);
    });
}