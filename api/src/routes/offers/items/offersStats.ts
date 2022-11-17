import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../../classes/APCNetworkProvider';
import { itemsCollection } from '../../../const';
import { withTryCatch, sendSuccessfulJSON } from '../../../utils/response';

export default async function getItemOffersStats(req: Request, res: Response, networkProvider: APCNetworkProvider) {

    withTryCatch(res, async () => {
        const cat = req.params.category;

        if (Object.keys(itemsCollection).includes(cat) == false) {
            res.status(400).send("Invalid category");
            return;
        }

        const collectionId = itemsCollection[cat as keyof typeof itemsCollection];

        const marketData = await networkProvider.getMarketData(collectionId);

        sendSuccessfulJSON(res, marketData);

    });
}