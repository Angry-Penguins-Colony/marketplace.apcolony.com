import ItemsDatabase from '@apcolony/db-marketplace/out/ItemsDatabase';
import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON, withTryCatch } from '../../utils/response';

export default async function getExploreItems(req: Request, res: Response, networkProvider: APCNetworkProvider, itemsDatabase: ItemsDatabase) {

    withTryCatch(res, async () => {


        const RANDOM_ITEMS_COUNT = 10;
        const RANDOM_PENGUINS_COUNT = 0;

        const items = await Promise.all(itemsDatabase.getRandomItems(RANDOM_ITEMS_COUNT)
            .map(async ({ id }) => itemsDatabase.getItemFromId(id)));

        const penguins = await networkProvider.getRandomPenguins(RANDOM_PENGUINS_COUNT);

        sendSuccessfulJSON(res, {
            items,
            penguins
        })
    });
}