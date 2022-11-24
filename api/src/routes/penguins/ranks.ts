import { IPenguin } from '@apcolony/marketplace-api';
import { Request, Response } from 'express';
import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { itemsDatabase } from '../../const';
import { sendSuccessfulJSON, withTryCatch } from '../../utils/response';

interface OutputPenguin {
    displayName: string;
    id: string;
    rank: number;
    thumbnailUrls: {
        /**
         * 1024x1204px
         */
        high: string;
        /**
         * 512x512px
         */
        small: string;
    };
}

const DEFAULT_START = 0;
const DEFAULT_SIZE = 10;
const MAX_SIZE_ALLOWED = 100;

// TODO: reduce size of response (1.6 MB)
export default async function getPenguinsRanks(req: Request, res: Response, proxyNetwork: APCNetworkProvider) {

    withTryCatch(res, async () => {

        const penguins = await proxyNetwork.getAllPenguins();

        // TODO: optimize this (there is a lot of iterations)
        const penguinsRanks: OutputPenguin[] = penguins
            .map(penguin => ({ ...penguin, score: calculateScore(penguin) }))
            .sort((a, b) => b.score - a.score)
            .map((penguin, index) => (
                {
                    id: penguin.id,
                    displayName: penguin.displayName,
                    thumbnailUrls: {
                        high: penguin.thumbnailUrls.high,
                        small: penguin.thumbnailUrls.small
                    },
                    rank: index + 1
                }
            ));

        const start = parseInt(req.params.start || DEFAULT_START.toString());
        const size = Math.min(parseInt(req.params.size || DEFAULT_SIZE.toString()), MAX_SIZE_ALLOWED);

        const penguinsRanksSlice = penguinsRanks.slice(start, start + size);

        sendSuccessfulJSON(res, penguinsRanksSlice);
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