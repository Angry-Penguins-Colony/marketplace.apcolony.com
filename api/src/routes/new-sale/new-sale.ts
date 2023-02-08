import { INewSaleData } from '@apcolony/marketplace-api';
import { Request, Response } from 'express';
import { sendSuccessfulJSON } from '../../utils/response';

export default async function getNewSaleInfo(
    req: Request,
    res: Response) {

    const id = req.params.id;

    switch (id) {
        case "1":
            const data1: INewSaleData = {
                item: {

                    url: 'https://apc-items.s3.eu-west-3.amazonaws.com/thumbnail_web/15-thumbnail-web.jpg',
                    displayName: 'Chewing Gum',
                },
                startTimestamp: -1,
                price: "100",
                token: {
                    symbol: '$ICE',
                    decimals: 0
                },
                maxSupply: 50,
                remainingSupply: 10
            };
            sendSuccessfulJSON(res, data1);
            break;

        case "2":
            const data2: INewSaleData = {
                item: {

                    url: 'https://apc-items.s3.eu-west-3.amazonaws.com/thumbnail_web/201-thumbnail-web.jpg',
                    displayName: 'Crossbow',
                },
                startTimestamp: Date.now() + 5 * 1000,
                price: "0.5e18",
                token: {
                    symbol: 'EGLD',
                    decimals: 18
                },
                maxSupply: 30,
                remainingSupply: 20
            };
            sendSuccessfulJSON(res, data2);
            break;

        default:
            res.status(400).send("Invalid id");
            return;
    }

}