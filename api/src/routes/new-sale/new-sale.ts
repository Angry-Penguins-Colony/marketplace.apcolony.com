import { INewSaleData } from '@apcolony/marketplace-api';
import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';

export default async function getNewSaleInfo(
    req: Request,
    res: Response,
    proxyNetwork: APCNetworkProvider) {

    const id = req.params.id;

    proxyNetwork.getNewSaleInfo(id)
        .then((newSaleData: INewSaleData) => sendSuccessfulJSON(res, { sale: newSaleData }))
        .catch((err: any) => {

            const getUserFriendlyErrorMessage = () => {
                switch (err.message) {
                    case "Auction ID invalid.":
                        return "The sale ID provided is invalid."

                    default:
                        return "The view from the gateway returned this error:" + err + +"\n" + err.stack;
                }
            };

            res.status(400).send(getUserFriendlyErrorMessage())
        });
}