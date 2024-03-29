import { Request, Response } from 'express';
import { itemsCollection } from '../../../const';
import { APCNetworkProvider } from '../../../classes/APCNetworkProvider';
import { sendSuccessfulJSON, withTryCatch } from '../../../utils/response';

export default async function getItemsOffers(req: Request, res: Response, networkProvider: APCNetworkProvider) {

    withTryCatch(res, async () => {

        const collections = getCollections();

        if (!collections) return;

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
    });
}

