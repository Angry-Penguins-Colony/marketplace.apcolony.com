import { Request, Response } from 'express';
import { penguinsCollection, itemsCollection } from '../../const';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';
import { getItemFromToken } from '../../utils/dbHelper';

export default async function getItemsOffers(req: Request, res: Response, networkProvider: APCNetworkProvider) {

    const cat = req.params.category;

    if (Object.keys(itemsCollection).includes(cat) == false) {
        res.status(400).send("Invalid category");
        return null;
    }

    const collectionId = itemsCollection[cat as keyof typeof itemsCollection];

    const offers = (await networkProvider.getOffers(collectionId));

    const response = {
        offers: offers
            .map(o => {
                return {
                    ...o,
                    ["price"]: o.price.toString(),
                }
            }),
        associatedItems: await Promise.all(offers
            .map(o => networkProvider.getItem(getItemFromToken(o.collection, o.nonce))))
    }

    sendSuccessfulJSON(res, response);

}