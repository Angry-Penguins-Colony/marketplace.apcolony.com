import { Request, Response } from 'express';
import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { sendSuccessfulJSON } from "../../utils/response";

export default async function getPenguinsStaked(req: Request, res: Response, proxyNetwork: APCNetworkProvider) {

    proxyNetwork.getNftsForStaker(req.params.bech32, proxyNetwork).then((penguinsInfo: any) => {
        sendSuccessfulJSON(res, penguinsInfo);
    }).catch((err) => {
        res.status(500).send(err);
    })
}



