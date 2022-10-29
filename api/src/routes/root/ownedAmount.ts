import { Address } from '@elrondnetwork/erdjs/out';
import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { itemsCollection, penguinsCollection, penguinsCount } from '../../const';
import { getItemFromToken, getRandomItems, getRandomsPenguinsIds, isCollectionAnItem } from '../../utils/dbHelper';
import { sendSuccessfulJSON } from '../../utils/response';
import { getIdFromPenguinName } from '../../utils/string';

export default async function getOwnedAmount(req: Request, res: Response, networkProvider: APCNetworkProvider): Promise<void> {

    const address = new Address(req.params.bech32);

    const nfts = await networkProvider.getNftsOfAccount(address);

    const penguinsById: Record<string, string> = {};
    const itemsById: Record<string, string> = {};

    for (const nft of nfts) {

        if (nft.collection == penguinsCollection) {
            const id = getIdFromPenguinName(nft.name).toString();
            penguinsById[id] = nft.supply.toString();
        }
        else if (isCollectionAnItem(nft.collection)) {
            const id = getItemFromToken(nft.collection, nft.nonce).id;
            itemsById[id] = nft.supply.toString();
        }
    }

    sendSuccessfulJSON(res, {
        penguins: penguinsById,
        items: itemsById,
    })
}