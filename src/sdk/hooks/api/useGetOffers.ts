import { IOffer } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import BigNumber from 'bignumber.js';
import useGenericAPICall from './useGenericAPICall';


function useGetOffers(category: 'penguins' | 'items', id: string) {

    const { address: connectedAddress } = useGetAccountInfo();

    const offers = useGenericAPICall<IOffer[]>(`/${category}/offer/${id}`);

    const ownedOffers = offers && offers.filter((offer) => offer.seller === connectedAddress);
    const buyableOffers = offers && offers.filter((offer) => offer.seller !== connectedAddress);
    const lowestBuyableOffer = (() => {

        if (!buyableOffers) return undefined;
        if (buyableOffers.length == 0) return null;

        return buyableOffers.reduce((prev, current) => (prev.price < current.price ? prev : current));
    })();

    // TODO: move the new BigNumber into useGetOffers
    const priceListedByUser = ownedOffers && ownedOffers.length > 0 ? new BigNumber((ownedOffers[0].price as any).value).toNumber() : 0;
    const isListedByConnected = ownedOffers && ownedOffers.length > 0;


    return {
        offers,
        ownedOffers,
        buyableOffers,
        lowestBuyableOffer,
        priceListedByUser,
        isListedByConnected
    }
}

export default useGetOffers;