import { Request, Response } from 'express';
import { Attributes } from "@apcolony/marketplace-api/out/classes"
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON, withTryCatch } from '../../utils/response';
import { IAttributesStatus } from '@apcolony/marketplace-api';

export default async function getAttributes(req: Request, res: Response, networkProvider: APCNetworkProvider) {

    withTryCatch(res, async () => {

        const attributes = parseAttributes(req);
        const penguinName = "Penguin #" + req.params.penguinId;

        const uri = await networkProvider.getUriOf(attributes, penguinName);

        sendResponse(res, {
            renderStatus: "none",
        })
        return;

        if (uri) {
            sendResponse(res, {
                renderStatus: "rendered",
                cid: uri
            })
        }
        else {
            const imagesToRender = await networkProvider.getAttributesToRender();

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

    })
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
