import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import ItemsDatabase from '../../classes/ItemsDatabase';
import { penguinsCount } from '../../const';
import { getRandomItems, getRandomsPenguinsIds } from '../../utils/dbHelper';
import { sendSuccessfulJSON } from '../../utils/response';

export default async function getExploreItems(req: Request, res: Response, networkProvider: APCNetworkProvider, itemsDatabase: ItemsDatabase) {

    const RANDOM_ITEMS_COUNT = 5;
    const RANDOM_PENGUINS_COUNT = 5;

    const items = await Promise.all(getRandomItems(RANDOM_ITEMS_COUNT)
        .map(async ({ id }) => itemsDatabase.getItemFromId(id)));

    const penguins = await Promise.all(getRandomsPenguinsIds(penguinsCount >= RANDOM_PENGUINS_COUNT ? RANDOM_PENGUINS_COUNT : penguinsCount)
        .map(async (i) => networkProvider.getPenguinFromId(i)));

    sendSuccessfulJSON(res, {
        items,
        penguins
    })
}