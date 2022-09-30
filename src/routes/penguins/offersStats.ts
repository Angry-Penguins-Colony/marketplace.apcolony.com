import { Request, Response } from 'express';
import { penguinsCollection, itemsCollection } from '../../const';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';
import { getItemFromToken } from '../../utils/dbHelper';

export default async function getPenguinsOffersStats(req: Request, res: Response, networkProvider: APCNetworkProvider) {

    const collectionId = penguinsCollection;

    const marketData = (await networkProvider.getMarketData(collectionId));

    sendSuccessfulJSON(res, marketData);
}