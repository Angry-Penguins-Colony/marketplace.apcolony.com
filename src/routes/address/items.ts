import { Request, Response } from 'express';
import { placeholdersItems } from '../../const';
import { sendSuccessfulJSON } from "../../utils";

export default async function getItems(req: Request, res: Response) {

    const data = [
        placeholdersItems.beak.Pipe,
        placeholdersItems.background.Red,
        placeholdersItems.hat['Blue Bitcoin Cap'],
        placeholdersItems.clothes['Coat With Brown Fur'],
        placeholdersItems.eyes.Black,
        placeholdersItems.eyes.Red,
    ];

    sendSuccessfulJSON(res, data);
}