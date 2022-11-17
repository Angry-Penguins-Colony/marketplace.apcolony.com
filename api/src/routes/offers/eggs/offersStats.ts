import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../../classes/APCNetworkProvider';
import { eggsCollection } from '../../../const';
import { withTryCatch, sendSuccessfulJSON } from '../../../utils/response';

export default async function getEggsOffersStats(req: Request, res: Response, networkProvider: APCNetworkProvider) {

    withTryCatch(res, async () => {


        const marketData = (await networkProvider.getMarketData([eggsCollection]));

        sendSuccessfulJSON(res, marketData);
    });
}