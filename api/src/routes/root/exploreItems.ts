import ItemsDatabase from '@apcolony/db-marketplace/out/ItemsDatabase';
import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { penguinsCount } from '../../const';
import { getRandomsPenguinsIds } from '../../utils/dbHelper';
import { sendSuccessfulJSON, withTryCatch } from '../../utils/response';

export default async function getExploreItems(req: Request, res: Response, networkProvider: APCNetworkProvider, itemsDatabase: ItemsDatabase) {

    withTryCatch(res, async () => {


        const RANDOM_ITEMS_COUNT = 5;
        const RANDOM_PENGUINS_COUNT = 5;

        const items = await Promise.all(itemsDatabase.getRandomItems(RANDOM_ITEMS_COUNT)
            .map(async ({ id }) => itemsDatabase.getItemFromId(id)));

        const penguins = await Promise.all(getRandomsPenguinsIds(penguinsCount >= RANDOM_PENGUINS_COUNT ? RANDOM_PENGUINS_COUNT : penguinsCount)
            .map(async (i) => networkProvider.getPenguinFromId(i)));

        sendSuccessfulJSON(res, {
            items,
            penguins
        })
    });
}