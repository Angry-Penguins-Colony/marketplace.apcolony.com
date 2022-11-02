import { penguinsCollection } from "../../const";
import { Request, Response } from 'express';
import { Address } from "@elrondnetwork/erdjs/out";
import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { sendSuccessfulJSON } from "../../utils/response";
import { Nonce } from "@elrondnetwork/erdjs-network-providers/out/primitives";

export default async function getPenguins(req: Request, res: Response, proxyNetwork: APCNetworkProvider) {

    try {

        const address = new Address(req.params.bech32);

        const penguins = await proxyNetwork.getPenguinsOfAccount(address);

        sendSuccessfulJSON(res, penguins);
    }
    catch (e: any) {
        console.trace(e);
        res.status(500).send(e.toString())
    }
}