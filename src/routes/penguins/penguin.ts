import { penguinsCollection } from "../../const";
import { Request, Response } from 'express';
import { ErrNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out/errors";
import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { sendSuccessfulJSON } from "../../utils/response";

export default async function getPenguin(req: Request, res: Response, proxyNetwork: APCNetworkProvider) {


    try {

        const penguin = await proxyNetwork.getPenguinFromId(req.params.id)

        if (penguin != undefined) {
            sendSuccessfulJSON(res, penguin);
        }
        else {
            res.status(404).send(`No penguin with ID ${req.params.id} found`);
        }
    }
    catch (e: any) {
        res.status(400).send(e.toString());
    }
}