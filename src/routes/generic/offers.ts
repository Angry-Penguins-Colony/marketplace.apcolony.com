import { Request, Response } from 'express';
import { penguinsCollection, itemsCollection } from '../../const';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';
import { getItemFromToken } from '../../utils/dbHelper';

export default async function getOffers(req: Request, res: Response, type: "items" | "penguins", networkProvider: APCNetworkProvider) {

    const collectionId = getCollectionId();

    if (collectionId) {
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

    function getCollectionId() {
        switch (type) {
            case "items":
                const cat = req.params.category;

                if (Object.keys(itemsCollection).includes(cat)) {
                    return itemsCollection[cat as keyof typeof itemsCollection];
                }
                else {
                    res.status(400).send("Invalid category");
                    return null;
                }

            case "penguins":
                return penguinsCollection;
        }
    }
}