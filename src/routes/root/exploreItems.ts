import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { getRandomItem, getRandomItems } from '../../utils/dbHelper';
import { sendSuccessfulJSON } from '../../utils/response';

export default async function getExploreItems(req: Request, res: Response, networkProvider: APCNetworkProvider) {

    const ITEM_COUNT = 5;

    const promisesItems = getRandomItems(ITEM_COUNT)
        .map(async (i) => networkProvider.getItem(i));
    const items = await Promise.all(promisesItems);


    // TODO: get 5 random penguins

    sendSuccessfulJSON(res, {
        items,
        penguins: []
    })
}