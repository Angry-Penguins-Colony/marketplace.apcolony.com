import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import BigNumber from 'bignumber.js';
import CategoriesType from 'sdk/types/CategoriesType';
import useGetActivity from './api/useGetActivity';
import { useGetGenericItem } from './api/useGetGenericItem';
import useGetOffers from './api/useGetOffers';
import useGetPenguin from './api/useGetPenguin';

function useInspect(category: CategoriesType, id: string) {
    const { address: connectedAddress } = useGetAccountInfo();
    const item = useGetGenericItem(category, id);

    const itemAsPenguin = useGetPenguin(id); // TODO: FIX 404 error in /items path
    const activities = useGetActivity(category, id);
    const offers = useGetOffers(category, id);
    const ownedOffers = offers && offers.filter((offer) => offer.seller === connectedAddress);
    const isListedByConnected = ownedOffers && ownedOffers.length > 0;
    const ownedByConnectedWallet = (() => {
        if (isListedByConnected) return true;

        if (category === 'penguins') return itemAsPenguin?.owner === connectedAddress;
        if (category === 'items' && item?.amount) return item?.amount > 0;
        return false;
    })()
    // TODO: move the new BigNumber into useGetOffers
    const priceListedByUser = ownedOffers && ownedOffers.length > 0 ? new BigNumber((ownedOffers[0].price as any).value).toNumber() : 0;


    return {
        item,
        isListedByConnected,
        ownedByConnectedWallet,
        priceListedByUser,
        activities,
        itemAsPenguin,
        ownedOffers
    }
}

export default useInspect;