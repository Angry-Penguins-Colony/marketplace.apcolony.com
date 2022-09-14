import { Request, Response } from 'express';
import Attributes from "@apcolony/marketplace-api/out/classes"

export default async function getAttributes(req: Request, res: Response) {

    const attributes = new Attributes();

    for (const slot in req.query) {
        const item = req.query[slot];

        if (typeof item === "string") {
            attributes.set(slot, item);
        }
    }

    console.log(attributes);

    // TODO: getCidOf from SC
    // => render

    // TODO: if doesn't work, get pending tx of SC w/ setCidOf in it
    // => rendering

    // TODO: if nothing, get pending tx list of SC
    // => rendering

    // TODO: else
    // => none

    res.status(501).send("Not implemented yet");
}