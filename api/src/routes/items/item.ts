import ItemsDatabase from '@apcolony/db-marketplace/out/ItemsDatabase';
import { Request, Response } from 'express';
import { sendSuccessfulJSON } from '../../utils/response';

export default async function getItem(req: Request, res: Response, itemsDatabase: ItemsDatabase) {

    try {

        const id = req.params.id;

        if (itemsDatabase.idExist(id)) {
            let item = itemsDatabase.getItemFromId(id);

            sendSuccessfulJSON(res, item);
        }
        else {
            res.status(400).send("Invalid id");
        }
    }
    catch (e: any) {
        console.trace(e);
        res.status(500).send(e.toString())
    }
}