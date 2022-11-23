import { Request, Response } from 'express';
import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { sendSuccessfulJSON, withTryCatch } from "../../utils/response";
import { isPenguinIdValid } from "../../utils/isPenguinIdValid";

export default async function getPenguin(req: Request, res: Response, proxyNetwork: APCNetworkProvider) {

    withTryCatch(res, async () => {
        const id = req.params.id;

        if (isPenguinIdValid(id) == false) {
            res.status(400).send("Invalid ID");
            return;
        }

        try {
            const penguin = await proxyNetwork.getPenguinFromId(req.params.id)

            sendSuccessfulJSON(res, penguin);
        }
        catch (e: any) {
            console.log(e);
            res.status(500).send(e.toString());
        }
    });
}

