import { IOffer } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import CategoriesType from 'sdk/types/CategoriesType';
import { RetireTransactionFilter, SellTransactionFilter } from '../transactionsFilters/filters';
import useGetOnTransactionSuccesful from '../useGetOnTransactionSuccesful';
import useGenericAPICall from './useGenericAPICall';


function useGetOffers(category: CategoriesType, id: string) {

    const { address: connectedAddress } = useGetAccountInfo();

    const { data: offers, forceReload: forceUpdate } = useGenericAPICall<IOffer[]>(`/offers/${category}/offer/${id}`);

    const ownedOffers = offers && offers.filter((offer) => offer.seller == connectedAddress);
    const buyableOffers = offers && offers.filter((offer) => offer.seller != connectedAddress);
    const floorPriceOffer = offers && offers.length > 0 ? offers.reduce((prev, current) => (prev.price < current.price ? prev : current)) : null;
    const lowestBuyableOffer = (() => {

        if (!offers && !buyableOffers) return undefined;
        if (!buyableOffers) return null;
        if (buyableOffers.length == 0) return null;

        return buyableOffers.reduce((prev, current) => (prev.price < current.price ? prev : current));
    })();

    const priceListedByUser = (ownedOffers && ownedOffers.length > 0) ? ownedOffers[0].price : 0;
    const isListedByConnected = ownedOffers && ownedOffers.length > 0;

    useGetOnTransactionSuccesful(
        () => forceUpdate(),
        new SellTransactionFilter()
    );

    useGetOnTransactionSuccesful(
        () => forceUpdate(),
        new RetireTransactionFilter()
    );

    return {
        offers,
        ownedOffers,
        buyableOffers,
        lowestBuyableOffer,
        floorPriceOffer,
        priceListedByUser,
        isListedByConnected
    }
}

export default useGetOffers;