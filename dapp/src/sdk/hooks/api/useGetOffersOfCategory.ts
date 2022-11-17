import { ElementType, IGenericElement, IOffer } from '@apcolony/marketplace-api';
import BigNumber from 'bignumber.js';
import useGenericAPICall from './useGenericAPICall';

interface Output {
    offers: IOffer[];
    associatedItems: IGenericElement[];
}

function useGetOffersOfCategory(category: ElementType, slot?: string) {

    const url = `/offers/${category}/${slot || ''}`;
    const { data, forceReload } = useGenericAPICall<Output>(url);

    const floorOffer = data?.offers
        .sort((a, b) => new BigNumber(a.price).comparedTo(b.price))[0];

    return {
        data: data,
        forceReload: forceReload,
        floorOffer: floorOffer
    };
}

export default useGetOffersOfCategory;