import { Request, Response } from 'express';
import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { penguinsCollection } from '../../const';
import { sendSuccessfulJSON } from "../../utils/response";
import { getIdFromPenguinName } from '../../utils/string';

export default async function getPenguinsStaked(req: Request, res: Response, proxyNetwork: APCNetworkProvider) {
    
    proxyNetwork.getNftsForStaker(req.params.bech32).then((nfts) => {
        sendSuccessfulJSON(res, {
            penguinsNonce : nfts
        });
    }).catch((err) => {
        // console.log(err);
        res.status(500).send(err);
    })
}
