import { penguinsCollection } from "../../const";
import { Request, Response } from 'express';
import { ErrNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out/errors";
import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { sendSuccessfulJSON } from "../../utils/response";
import { isPenguinIdValid } from "../../utils/isPenguinIdValid";

export default async function getPenguin(req: Request, res: Response, proxyNetwork: APCNetworkProvider) {

    const id = req.params.id;

    if (isPenguinIdValid(id)) {

        try {
            const penguin = await proxyNetwork.getPenguinFromId(req.params.id)

            sendSuccessfulJSON(res, penguin);
        }
        catch (e: any) {
            console.log(e);
            res.status(400).send(e.toString());
        }
    }
    else {
        res.status(400).send("Invalid ID");
    }
}

