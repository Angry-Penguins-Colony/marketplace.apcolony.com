import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { Request, Response } from 'express';
import { sendSuccessfulJSON } from "../../utils/response";
import { penguinsCollection } from "../../const";
import { IOffer } from "@apcolony/marketplace-api";
import { filterOffers } from "../../utils/filter";

export default async function getOffer(req: Request, res: Response, type: "penguins" | "items", networkProvider: APCNetworkProvider) {

    try {

        const { collection, nonce } = await networkProvider.getToken(type, req.params.id);
        const offer = (await networkProvider.getOffers([collection]))
            .filter(o => o.nonce == nonce);

        sendSuccessfulJSON(res, offer);
    }
    catch (e: any) {
        res.status(400).send(e.toString())
    }

}

export async function getOffersOfAccount(req: Request, res: Response, networkProvider: APCNetworkProvider) {
    try {
        const account = req.params.bech32;
        const offersOfAccount = await networkProvider.getOffersOfAccount(account);

        const { penguinsOffers, itemsOffers } = filterOffers(offersOfAccount);

        const associatedPenguins = await networkProvider.getPenguinsFromOffers(penguinsOffers);
        const associatedItems = networkProvider.getItemsFromOffers(itemsOffers);

        sendSuccessfulJSON(res, {
            offers: offersOfAccount,
            associatedPenguins,
            associatedItems
        });
    }
    catch (e: any) {
        res.status(400).send(e.toString());
    }
}
