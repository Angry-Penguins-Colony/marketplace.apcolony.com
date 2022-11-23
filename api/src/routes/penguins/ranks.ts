import { Request, Response } from 'express';
import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { withTryCatch } from '../../utils/response';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function getPenguinsRanks(req: Request, res: Response, proxyNetwork: APCNetworkProvider) {

    withTryCatch(res, async () => {
        throw new Error("Not implemented");
    });
}

