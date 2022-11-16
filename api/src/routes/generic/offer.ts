import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { Request, Response } from 'express';
import { sendSuccessfulJSON, withTryCatch } from "../../utils/response";
import { penguinsCollection } from "../../const";
import { IOffer } from "@apcolony/marketplace-api";
import { filterOffers } from "../../utils/filter";

export default async function getOffer(req: Request, res: Response, type: "penguins" | "items", networkProvider: APCNetworkProvider) {

    withTryCatch(res, async () => {
        const { collection, nonce } = await networkProvider.getToken(type, req.params.id);

        const offer = (await networkProvider.getOffers([collection]))
            .filter(o => o.nonce == nonce);

        sendSuccessfulJSON(res, offer);
    });
}

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
