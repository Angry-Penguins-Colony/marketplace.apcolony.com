import { Request, Response } from 'express';
import { penguinsCollection, itemsCollection } from '../../const';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';
import { getItemFromToken } from '../../utils/dbHelper';

export default async function getPenguinsOffersStats(req: Request, res: Response, networkProvider: APCNetworkProvider) {

    const marketData = (await networkProvider.getMarketData([penguinsCollection]));

    sendSuccessfulJSON(res, marketData);
}