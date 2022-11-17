import { ElementType, IActivity } from '@apcolony/marketplace-api';
import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON, withTryCatch } from '../../utils/response';
import { isElementType } from '../../utils/string';

export default async function getActivity(req: Request, res: Response, networkProvider: APCNetworkProvider) {

    withTryCatch(res, async () => {
        const id = req.params.id;
        const type = req.params.type;

        if (isElementType(type) == false) {
            res.status(400).send("Invalid element type");
            return;
        }

        const { collection, nonce } = await networkProvider.getToken(type as ElementType, id);
        const activities: IActivity[] = await networkProvider.getActivities(collection, nonce);

        sendSuccessfulJSON(res, activities);
    });
}

