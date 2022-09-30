import { IActivity } from '@apcolony/marketplace-api';
import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';

export default async function getActivity(req: Request, res: Response, type: "items" | "penguins", networkProvider: APCNetworkProvider) {

    const id = req.params.id;

    const { collection, nonce } = await networkProvider.getToken(type, req.params.id);
    const activities: IActivity[] = await networkProvider.getActivities(collection, nonce);

    sendSuccessfulJSON(res, activities);
}