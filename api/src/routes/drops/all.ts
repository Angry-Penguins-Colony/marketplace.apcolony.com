import { IDropData } from '@apcolony/marketplace-api';
import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';

export default async function getAllDropsData(
    req: Request,
    res: Response,
    proxyNetwork: APCNetworkProvider) {

    proxyNetwork.getAllDropsData()
        .then((data: IDropData[]) => sendSuccessfulJSON(res, data))
        .catch((err: any) => {

            const getUserFriendlyErrorMessage = () => {
                switch (err.message) {
                    default:
                        return "The view from the gateway returned this error:" + err + +"\n" + err.stack;
                }
            };

            console.trace(err);

            res.status(400).send(getUserFriendlyErrorMessage())
        });
}