import { Address } from '@elrondnetwork/erdjs/out';
import { Request, Response } from 'express';
import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { items } from '../../const';
import { getItemFromName } from '../../utils/dbHelper';
import { sendSuccessfulJSON } from '../../utils/response';

export default async function getItem(req: Request, res: Response, proxyNetwork: APCNetworkProvider) {

    const id = req.params.id;

    const associatedItem = items
        .find(i => i.id == id);

    if (associatedItem == undefined) {
        res.status(400).send("Invalid id");
        return;
    }

    let item;
    if (req.query.owner) {
        item = await proxyNetwork.getItem(associatedItem, Address.fromBech32(req.query.owner as string));
    }
    else {
        item = await proxyNetwork.getItem(associatedItem);
    }

    sendSuccessfulJSON(res, item);
}