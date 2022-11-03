import { Address } from '@elrondnetwork/erdjs/out';
import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON, withTryCatch } from '../../utils/response';

export default async function getOwnedItems(req: Request, res: Response, gatewayProvider: APCNetworkProvider) {

    withTryCatch(res, async () => {
        const address = new Address(req.params.bech32);
        const items = await gatewayProvider.getItemsOfAccount(address);
        sendSuccessfulJSON(res, items);
    });
}