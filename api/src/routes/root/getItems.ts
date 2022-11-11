import ItemsDatabase from '@apcolony/db-marketplace/out/ItemsDatabase';
import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { penguinsCount } from '../../const';
import { getRandomsPenguinsIds } from '../../utils/dbHelper';
import { sendSuccessfulJSON, withTryCatch } from '../../utils/response';

export default async function getItemsList(req: Request, res: Response, networkProvider: APCNetworkProvider) {

    withTryCatch(res, async () => {
        sendSuccessfulJSON(res, await networkProvider.getItemsList());
    });
}