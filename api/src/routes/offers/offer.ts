import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { Request, Response } from 'express';
import { sendSuccessfulJSON, withTryCatch } from "../../utils/response";
import { penguinsCollection } from "../../const";
import { ElementType, IOffer } from "@apcolony/marketplace-api";
import { filterOffers } from "../../utils/filter";

export default async function getOffer(req: Request, res: Response, type: ElementType, networkProvider: APCNetworkProvider) {

    withTryCatch(res, async () => {
        const { collection, nonce } = await networkProvider.getToken(type, req.params.id);

        const offer = (await networkProvider.getOffers([collection]))
            .filter(o => o.nonce == nonce);

        sendSuccessfulJSON(res, offer);
    });
}

