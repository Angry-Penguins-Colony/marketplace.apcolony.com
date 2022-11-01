import { Request, Response } from 'express';
import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { penguinsCollection } from '../../const';
import { sendSuccessfulJSON } from "../../utils/response";
import { getIdFromPenguinName } from '../../utils/string';

export default async function getStakingClaimable(req: Request, res: Response, proxyNetwork: APCNetworkProvider) {

    proxyNetwork.getNftsNumberAndRewardsAvailableForStaker(req.params.bech32).then((data) => {
        sendSuccessfulJSON(res, {
            claimable: data.value
        });
    }).catch((err) => {
        // console.log(err);
        res.status(500).send(err);
    })
}
