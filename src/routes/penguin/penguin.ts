import { penguinsCollection } from "../../const";
import { Request, Response } from 'express';
import { Address } from "@elrondnetwork/erdjs/out";
import { APCProxyNetworkProvider } from "../../classes/APCProxyNetworkProvider";
import { sendSuccessfulJSON } from "../../utils/response";

export default async function getPenguin(req: Request, res: Response, proxyNetwork: APCProxyNetworkProvider) {

    const nonce = parseInt(req.params.nonce);

    if (isNaN(nonce)) {
        res.status(400).send("Invalid nonce");
        return;
    }

    const nft = await proxyNetwork.getNft(penguinsCollection, nonce);
    const penguin = await proxyNetwork.getPenguinFromNft(nft);

    sendSuccessfulJSON(res, penguin);
}