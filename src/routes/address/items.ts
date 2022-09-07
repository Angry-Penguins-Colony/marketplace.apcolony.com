import { Address } from '@elrondnetwork/erdjs/out';
import { Request, Response } from 'express';
import { ProxyNetwork } from '../../classes/ProxyNetwork';
import { itemsCollection } from '../../const';
import { getItemFromNft, sendSuccessfulJSON } from '../../utils';

export default async function getItems(req: Request, res: Response, gatewayUrl: string) {

    const address = new Address(req.params.bech32);
    const gatewayProvider = new ProxyNetwork(gatewayUrl);

    const accountsNfts = await gatewayProvider.getNftsOfAccount(address);

    const items = accountsNfts
        .filter(nft => Object.values(itemsCollection).includes(nft.collection))
        .map(getItemFromNft);

    console.log("Found", items.length, "items.");

    sendSuccessfulJSON(res, items);
}