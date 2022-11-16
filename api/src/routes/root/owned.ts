import ItemsDatabase from '@apcolony/db-marketplace/out/ItemsDatabase';
import { Address } from '@elrondnetwork/erdjs/out';
import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON, withTryCatch } from '../../utils/response';

export default async function getOwnedItemsAndPenguins(req: Request, res: Response, networkProvider: APCNetworkProvider, itemsDatabase: ItemsDatabase): Promise<void> {

    withTryCatch(res, async () => {
        const address = new Address(req.params.bech32);

        sendSuccessfulJSON(res, await networkProvider.getInventory(address));
    });
}