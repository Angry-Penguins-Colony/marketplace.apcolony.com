import { Address } from '@elrondnetwork/erdjs/out';
import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { itemsCollection } from '../../const';
import { getItemFromToken } from '../../utils/dbHelper';
import { sendSuccessfulJSON } from '../../utils/response';

export default async function getItems(req: Request, res: Response, gatewayProvider: APCNetworkProvider) {

    const address = new Address(req.params.bech32);

    const accountsNfts = await gatewayProvider.getNftsOfAccount(address);

    const items = accountsNfts
        .filter(nft => Object.values(itemsCollection).includes(nft.collection))
        .map(nft => gatewayProvider.getItem(getItemFromToken(nft.collection, nft.nonce)));

    console.log("Found", items.length, "items.");

    sendSuccessfulJSON(res, await Promise.all(items));
}