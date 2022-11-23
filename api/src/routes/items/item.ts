import ItemsDatabase from '@apcolony/db-marketplace/out/ItemsDatabase';
import { Address } from '@elrondnetwork/erdjs/out';
import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON, withTryCatch } from '../../utils/response';

export default async function getItem(
    req: Request,
    res: Response,
    itemsDatabase: ItemsDatabase,
    networkProvider: APCNetworkProvider
) {

    withTryCatch(res, async () => {

        const id = req.params.id;
        const owner = req.query.owner;

        if (itemsDatabase.idExist(id)) {
            const item = itemsDatabase.getItemFromId(id);

            if (owner && typeof owner == "string") {
                const supply = await networkProvider.getItemSupplyOfAccount(Address.fromBech32(owner), id);

                sendSuccessfulJSON(res, {
                    ownedAmount: supply,
                    ...item
                })
            }
            else {
                sendSuccessfulJSON(res, item);
            }
        }
        else {
            res.status(400).send("Invalid id");
        }
    });
}