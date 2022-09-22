import { penguinsCollection } from "../../const";
import { Request, Response } from 'express';
import { ErrNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out/errors";
import { APCProxyNetworkProvider } from "../../classes/APCProxyNetworkProvider";
import { sendSuccessfulJSON } from "../../utils/response";

export default async function getPenguin(req: Request, res: Response, proxyNetwork: APCProxyNetworkProvider) {

    const nonce = parseInt(req.params.nonce);

    if (isNaN(nonce)) {
        res.status(400).send("Invalid nonce");
        return;
    }

    const nft = await proxyNetwork.getNft(penguinsCollection, nonce)
        .catch((err: ErrNetworkProvider) => { res.status(501).send(err.message); return undefined; });

    if (nft != undefined) {
        const penguin = await proxyNetwork.getPenguinFromNft(nft);

        sendSuccessfulJSON(res, penguin);
    }
}