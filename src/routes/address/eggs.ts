import { Request, Response } from 'express';

export default async function getEggs(req: Request, res: Response) {

    res.status(501).send("Not implemented yet");
}