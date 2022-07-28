import { placeholdersPenguins } from "../../const";
import { query, Request, Response } from 'express';
import { sendSuccessfulJSON } from "../../utils";

export default async function getPenguins(req: Request, res: Response) {

    const data = [
        placeholdersPenguins[4987],
        placeholdersPenguins[4782],
        placeholdersPenguins[1155],
    ];

    sendSuccessfulJSON(res, data);
}