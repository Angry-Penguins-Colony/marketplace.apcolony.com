import { Request, Response } from 'express';
import { Attributes } from "@apcolony/marketplace-api/out/classes"
import { APCProxyNetworkProvider } from '../../classes/APCProxyNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';
import { IAttributesStatus } from '@apcolony/marketplace-api';

export default async function getAttributes(req: Request, res: Response, networkProvider: APCProxyNetworkProvider) {

    const attributes = parseAttributes(req);

    const cid = await networkProvider.getCidOf(attributes);

    if (cid) {
        sendResponse(res, {
            renderStatus: "rendered",
            cid
        })
    }
    else {
        const imagesToRender = await networkProvider.getAttributesToRender();
        console.log(imagesToRender);

        if (imagesToRender.find(a => a.equals(attributes)) != undefined) {
            sendResponse(res, {
                renderStatus: "rendering",
            })
        }
        else {
            sendResponse(res, {
                renderStatus: "none",
            })
        }
    }

}

function sendResponse(res: Response, data: IAttributesStatus) {
    sendSuccessfulJSON(res, data);
}

function parseAttributes(req: Request): Attributes {
    const attributes = new Attributes();

    for (const slot in req.query) {
        const item = req.query[slot];

        if (typeof item === "string") {
            attributes.set(slot, item);
        }
    }
    return attributes;
}
