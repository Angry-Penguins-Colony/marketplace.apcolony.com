import { Request, Response } from 'express';
import { placeholdersEggs } from '../../const';
import { sendSuccessfulJSON } from "../../utils";

export default async function getEggs(req: Request, res: Response) {

    res.status(501).send("Not implemented yet");
}