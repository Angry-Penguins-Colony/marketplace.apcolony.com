import { Address } from '@elrondnetwork/erdjs/out';
import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON, withTryCatch } from '../../utils/response';

export async function getInventoryOfAccount(req: Request, res: Response, networkProvider: APCNetworkProvider): Promise<void> {

    withTryCatch(res, async () => {
        const address = new Address(req.params.bech32);

        sendSuccessfulJSON(res, await networkProvider.getInventory(address));
    });
}

export async function getPenguinsOfAccount(req: Request, res: Response, proxyNetwork: APCNetworkProvider) {

    withTryCatch(res, async () => {

        const address = new Address(req.params.bech32);

        const penguins = await proxyNetwork.getPenguinsOfAccount(address);

        sendSuccessfulJSON(res, penguins);

    });
}

export async function getItemsOfAccount(req: Request, res: Response, gatewayProvider: APCNetworkProvider) {

    withTryCatch(res, async () => {
        const address = new Address(req.params.bech32);
        const items = await gatewayProvider.getItemsOfAccount(address);
        sendSuccessfulJSON(res, items);
    });
}
