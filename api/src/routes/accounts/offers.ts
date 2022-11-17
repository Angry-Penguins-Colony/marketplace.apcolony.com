import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { Request, Response } from 'express';
import { sendSuccessfulJSON, withTryCatch } from "../../utils/response";
import { filterOffers } from "../../utils/filter";

export async function getOffersOfAccount(req: Request, res: Response, networkProvider: APCNetworkProvider) {
    withTryCatch(res, async () => {
        const account = req.params.bech32;
        const offersOfAccount = await networkProvider.getOffersOfAccount(account);

        const { penguinsOffers, itemsOffers, eggsOffers } = filterOffers(offersOfAccount);

        sendSuccessfulJSON(res, {
            offers: offersOfAccount,
            associated: {
                "penguins": await networkProvider.getPenguinsFromOffers(penguinsOffers),
                "items": networkProvider.getItemsFromOffers(itemsOffers),
                "eggs": networkProvider.getEggsFromOffers(eggsOffers)

            }
        });

    });
}
