import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { Request, Response } from 'express';
import { sendSuccessfulJSON } from "../../utils/response";

export default async function getOffer(req: Request, res: Response, type: "penguins" | "items", networkProvider: APCNetworkProvider) {

    try {

        const { collection, nonce } = await networkProvider.getToken(type, req.params.id);
        const offer = (await networkProvider.getOffers(collection))
            .filter(o => o.nonce == nonce)[0];

        sendSuccessfulJSON(res, offer);
    }
    catch (e: any) {
        res.status(400).send(e.toString())
    }

}