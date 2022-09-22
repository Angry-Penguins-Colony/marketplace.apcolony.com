import { IActivity } from '@apcolony/marketplace-api';
import { Request, Response } from 'express';
import { sendSuccessfulJSON } from '../../utils/response';

export default async function getActivity(req: Request, res: Response, type: "items" | "penguins") {

    // TODO: fill it
    sendSuccessfulJSON(res, []);
}