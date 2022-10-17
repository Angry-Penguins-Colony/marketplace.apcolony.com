import { Request, Response } from 'express';
import { penguinsCollection, itemsCollection } from '../../const';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';
import { getItemFromToken } from '../../utils/dbHelper';

export default async function getPenguinsOffers(req: Request, res: Response, networkProvider: APCNetworkProvider) {


    const offers = (await networkProvider.getOffers([penguinsCollection]));

    const response = {
        offers: offers,
        associatedItems: await getPenguinsFromOffers()
    };

    sendSuccessfulJSON(res, response);

    async function getPenguinsFromOffers() {
        const nfts = await Promise.all(offers.map(o => networkProvider.getNft(o.collection, o.nonce)));

        return nfts
            .filter(nft => !!nft.owner)
            .map(nft => networkProvider.getPenguinFromNft(nft));
    }
}