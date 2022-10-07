import { Request, Response } from 'express';
import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { itemsDatabase } from '../../const';
import { sendSuccessfulJSON } from '../../utils/response';

export default async function getItem(req: Request, res: Response, proxyNetwork: APCNetworkProvider) {

    const id = req.params.id;

    if (itemsDatabase.idExist(id)) {
        let item = itemsDatabase.getItemFromId(id);

        sendSuccessfulJSON(res, item);
    }
    else {
        res.status(400).send("Invalid id");
    }
}