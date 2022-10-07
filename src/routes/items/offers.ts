import { Request, Response } from 'express';
import { penguinsCollection, itemsCollection, itemsDatabase } from '../../const';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';
import { getItemFromToken, getTokenFromItemID } from '../../utils/dbHelper';
import { IItem } from '@apcolony/marketplace-api';

export default async function getItemsOffers(req: Request, res: Response, networkProvider: APCNetworkProvider) {

    const cat = req.params.category;

    if (Object.keys(itemsCollection).includes(cat) == false) {
        res.status(400).send("Invalid category");
        return null;
    }

    const collectionId = itemsCollection[cat as keyof typeof itemsCollection];

    const offers = (await networkProvider.getOffers(collectionId));

    const associatedItems: IItem[] = await (() => {
        const tokens = offers
            .map(offer => getItemFromToken(offer.collection, offer.nonce));

        const uniqueIds = [...new Set(tokens.map(token => token.id))];
        const uniqueTokens = uniqueIds
            .map(id => getTokenFromItemID(id));

        const itemsPromises = uniqueTokens
            .map(({ collection, nonce }) => itemsDatabase.getItemFromToken(collection, nonce));

        return Promise.all(itemsPromises);
    })();

    const response = {
        offers: offers,
        associatedItems: associatedItems
    }

    sendSuccessfulJSON(res, response);

}