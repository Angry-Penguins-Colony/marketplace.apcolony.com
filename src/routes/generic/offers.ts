import { Request, Response } from 'express';
import { sendSuccessfulJSON } from '../../utils/response';

export default async function getOffers(req: Request, res: Response, type: "items" | "penguins") {

    sendSuccessfulJSON(res, []);
}