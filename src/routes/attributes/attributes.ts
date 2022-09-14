import { Request, Response } from 'express';
import Attributes from "@apcolony/marketplace-api/out/classes"
import { APCProxyNetworkProvider } from '../../classes/APCProxyNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';
import { IAttributesStatus } from '@apcolony/marketplace-api';

export default async function getAttributes(req: Request, res: Response, networkProvider: APCProxyNetworkProvider) {

    const attributes = new Attributes();

    for (const slot in req.query) {
        const item = req.query[slot];

        if (typeof item === "string") {
            attributes.set(slot, item);
        }
    }

    const cid = await networkProvider.getCidOf(attributes);

    if (cid) {
        const output: IAttributesStatus = {
            renderStatus: "rendered",
            cid: cid
        };
        sendSuccessfulJSON(res, output)
    }
    else {
        res.status(501).send("Not implemented yet");
    }

    // TODO: if doesn't work, get pending tx of SC w/ setCidOf in it
    // => rendering

    // TODO: if nothing, get pending tx list of SC
    // => rendering

    // TODO: else
    // => none


}