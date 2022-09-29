import { IOffer } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import useGenericAPICall from './useGenericAPICall';


function useGetOffers(category: 'penguins' | 'items', id: string) {

    const { address: connectedAddress } = useGetAccountInfo();

    const offers = useGenericAPICall<IOffer[]>(`/${category}/offer/${id}`);

    const ownedOffers = offers && offers.filter((offer) => offer.seller == connectedAddress);
    const buyableOffers = offers && offers.filter((offer) => offer.seller != connectedAddress);
    const lowestBuyableOffer = (() => {

        if (!offers && !buyableOffers) return undefined;
        if (!buyableOffers) return null;
        if (buyableOffers.length == 0) return null;

        return buyableOffers.reduce((prev, current) => (prev.price < current.price ? prev : current));
    })();

    const priceListedByUser = (ownedOffers && ownedOffers.length > 0) ? ownedOffers[0].price : 0;
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