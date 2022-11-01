import { Request, Response } from 'express';
import { penguinsCollection, itemsCollection } from '../../const';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';
import ItemsDatabase from '@apcolony/db-marketplace/out/ItemsDatabase';

export default async function getItemsOffers(req: Request, res: Response, networkProvider: APCNetworkProvider, itemsDatabase: ItemsDatabase) {

    try {

        const collections = getCollections();

        if (!collections) return null;

        const offers = (await networkProvider.getOffers(collections));

        const response = {
            offers: offers,
            associatedItems: networkProvider.getItemsFromOffers(offers)
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
    catch (e: any) {
        console.trace(e);
        res.status(500).send(e.toString())
    }
}

