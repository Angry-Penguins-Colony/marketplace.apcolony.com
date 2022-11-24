import { IPenguin } from '@apcolony/marketplace-api';
import { Request, Response } from 'express';
import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { itemsDatabase } from '../../const';
import { sendSuccessfulJSON, withTryCatch } from '../../utils/response';

interface RankedPenguin extends IPenguin {
    rank: number;
}

// TODO: reduce size of response (19 MB)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function getPenguinsRanks(req: Request, res: Response, proxyNetwork: APCNetworkProvider) {

    withTryCatch(res, async () => {

        const penguins = await proxyNetwork.getAllPenguins();

        // TODO: optimize this (there is a lot of iterations)
        const penguinsRanks: RankedPenguin[] = penguins
            .map(penguin => ({ ...penguin, score: calculateScore(penguin) }))
            .sort((a, b) => b.score - a.score)
            .map((penguin, index) => ({ ...penguin, rank: index + 1 }));

        sendSuccessfulJSON(res, penguinsRanks);
    });
}

function calculateScore(penguin: IPenguin): number {

    let score = 0;

    for (const slot in penguin.equippedItems) {
        const item = penguin.equippedItems[slot];

        score += itemsDatabase.calculateItemScore(item);
    }

    return score;
}