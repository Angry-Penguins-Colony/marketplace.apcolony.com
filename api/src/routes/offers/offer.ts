import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { Request, Response } from 'express';
import { sendSuccessfulJSON, withTryCatch } from "../../utils/response";
import { penguinsCollection } from "../../const";
import { ElementType, IOffer } from "@apcolony/marketplace-api";
import { filterOffers } from "../../utils/filter";
import { isElementType } from "../../utils/string";

export default async function getOffer(req: Request, res: Response, networkProvider: APCNetworkProvider) {

    withTryCatch(res, async () => {
        const type = req.params.type;

        if (isElementType(type) == false) {
            res.status(400).send("Invalid element type");
            return;
        }

        const { collection, nonce } = await networkProvider.getToken(type as ElementType, req.params.id);

        const offer = (await networkProvider.getOffers([collection]))
            .filter(o => o.nonce == nonce);

        sendSuccessfulJSON(res, offer);
    });
}

