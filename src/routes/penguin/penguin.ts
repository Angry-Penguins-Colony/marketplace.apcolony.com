import { penguinsCollection } from "../../const";
import { Request, Response } from 'express';
import { ErrNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out/errors";
import { APCProxyNetworkProvider } from "../../classes/APCProxyNetworkProvider";
import { sendSuccessfulJSON } from "../../utils/response";

export default async function getPenguin(req: Request, res: Response, proxyNetwork: APCProxyNetworkProvider) {


    const penguin = await proxyNetwork.getPenguinFromId(req.params.id)
        .catch((err: any) => {
            if (err instanceof ErrNetworkProvider) {
                res.status(400).send(err.message);
                return undefined;
            }
            else {
                res.status(400).send(err.message);
            }
        })

    if (penguin != undefined) {
        sendSuccessfulJSON(res, penguin);
    }
    else {
        res.status(404).send(`No penguin with ID ${req.params.id} found`);
    }
}