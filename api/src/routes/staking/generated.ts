import { Request, Response } from 'express';
import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { sendSuccessfulJSON } from "../../utils/response";

export default async function getGeneratedTokens(req: Request, res: Response, proxyNetwork: APCNetworkProvider) {

    proxyNetwork.getTokensGeneratedByTheSc().then((data) => {
        sendSuccessfulJSON(res, {
            tokensGenerated: data
        });
    }).catch((err) => {
        res.status(500).send(err);
    })
}
