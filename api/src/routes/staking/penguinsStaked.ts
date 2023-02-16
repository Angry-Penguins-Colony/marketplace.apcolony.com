import { Request, Response } from 'express';
import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { sendSuccessfulJSON } from "../../utils/response";

export default async function getTotalPenguinsStaked(req: Request, res: Response, proxyNetwork: APCNetworkProvider) {

    proxyNetwork.getTotalPenguinsStakedInSc().then((data) => {
        sendSuccessfulJSON(res, {
            totalPenguinsStaked: data
        });
    }).catch((err) => {
        res.status(500).send(err);
    })
}
