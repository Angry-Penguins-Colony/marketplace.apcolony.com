import { Request, Response } from 'express';
import { itemsCollection } from '../../const';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';

export default async function getItemOffersStats(req: Request, res: Response, networkProvider: APCNetworkProvider) {

    try {

        const cat = req.params.category;

        if (Object.keys(itemsCollection).includes(cat) == false) {
            res.status(400).send("Invalid category");
            return null;
        }

        const collectionId = itemsCollection[cat as keyof typeof itemsCollection];

        const marketData = await networkProvider.getMarketData(collectionId);

        sendSuccessfulJSON(res, marketData);
    }
    catch (e: any) {
        console.trace(e);
        res.status(500).send(e.toString())
    }
}