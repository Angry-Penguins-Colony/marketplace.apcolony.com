import { Request, Response } from 'express';
import { placeholdersEggs } from '../../const';
import { sendSuccessfulJSON } from "../../utils";

export default async function getEggs(req: Request, res: Response) {

    const data = [
        placeholdersEggs.silver,
        placeholdersEggs.silver,
        placeholdersEggs.silver,
        placeholdersEggs.gold,
        placeholdersEggs.gold,
        placeholdersEggs.diamond,
        placeholdersEggs.diamond,
    ];

    sendSuccessfulJSON(res, data);
}