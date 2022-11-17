import { IActivity } from '@apcolony/marketplace-api';
import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON, withTryCatch } from '../../utils/response';

export default async function getActivity(req: Request, res: Response, type: "items" | "penguins", networkProvider: APCNetworkProvider) {

    withTryCatch(res, async () => {
        const id = req.params.id;

        const { collection, nonce } = await networkProvider.getToken(type, id);
        const activities: IActivity[] = await networkProvider.getActivities(collection, nonce);

        sendSuccessfulJSON(res, activities);
    });
}