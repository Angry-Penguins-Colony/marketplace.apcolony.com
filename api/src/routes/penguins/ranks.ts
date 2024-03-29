import { Request, Response } from 'express';
import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
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


export default async function getPenguinsRanks(req: Request, res: Response, proxyNetwork: APCNetworkProvider) {

    withTryCatch(res, async () => {


        const search = req.query.search as string;

        if (search) {
            const match = await proxyNetwork.getRankedPenguin(search);

            sendSuccessfulJSON(res, match ? [match] : []);
        }
        else {
            const penguinsRanks = await proxyNetwork.getRankedPenguins();

            const { start, size } = getPaginationsParams(req);

            const penguinsRanksSlice: OutputPenguin[] = penguinsRanks
                .slice(start, start + size)
                .map((penguin, index) => (
                    {
                        id: penguin.id,
                        displayName: penguin.displayName,
                        thumbnailUrls: {
                            high: penguin.thumbnailUrls.high,
                            small: penguin.thumbnailUrls.small
                        },
                        rank: start + index + 1
                    }
                ));

            sendSuccessfulJSON(res, penguinsRanksSlice);
        }
    });
}

function getPaginationsParams(req: Request) {
    const DEFAULT_START = 0;
    const DEFAULT_SIZE = 10;
    const MAX_SIZE_ALLOWED = 100;

    let start = DEFAULT_START;
    let size = DEFAULT_SIZE;

    if (req.query.start) {
        start = parseInt(req.query.start as string);
    }

    if (req.query.size) {

        size = parseInt(req.query.size as string);

        if (size > MAX_SIZE_ALLOWED) {
            throw new Error(`Size is too big. Max allowed is ${MAX_SIZE_ALLOWED}`);
        }
    }

    return { start, size };
} 