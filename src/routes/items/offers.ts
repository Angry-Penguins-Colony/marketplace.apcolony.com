import { Request, Response } from 'express';
import { penguinsCollection, itemsCollection } from '../../const';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';
import { getItemFromToken, getTokenFromItemID } from '../../utils/dbHelper';
import { IItem } from '@apcolony/marketplace-api';
import ItemsDatabase from '../../classes/ItemsDatabase';

export default async function getItemsOffers(req: Request, res: Response, networkProvider: APCNetworkProvider, itemsDatabase: ItemsDatabase) {

    const collections = getCollections();

    if (!collections) return null;

    const offers = (await networkProvider.getOffers(collections));

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

    function getCollections(): string[] | null {
        const cat = req.params.category;

        if (!cat) {
            return Object.values(itemsCollection).flat();
        }
        else {
            if (Object.keys(itemsCollection).includes(cat) == false) {
                res.status(400).send("Invalid category");
                return null;
            }

            return itemsCollection[cat as keyof typeof itemsCollection];
        }
    }
}

