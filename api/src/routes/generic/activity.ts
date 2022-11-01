import { IActivity } from '@apcolony/marketplace-api';
import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';

export default async function getActivity(req: Request, res: Response, type: "items" | "penguins", networkProvider: APCNetworkProvider) {

    try {

        const id = req.params.id;

        const { collection, nonce } = await networkProvider.getToken(type, req.params.id);
        const activities: IActivity[] = await networkProvider.getActivities(collection, nonce);

        sendSuccessfulJSON(res, activities);
    }
    catch (e: any) {
        console.trace(e);
        res.status(500).send(e.toString())
    }
}