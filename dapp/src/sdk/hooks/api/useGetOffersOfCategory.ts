import { IGenericElement, IOffer } from '@apcolony/marketplace-api';
import BigNumber from 'bignumber.js';
import useGenericAPICall from './useGenericAPICall';

interface Output {
    offers: IOffer[];
    associatedItems: IGenericElement[];
}

function useGetOffersOfCategory(category: 'penguins' | string) {

    const { data, forceReload } = useGenericAPICall<Output>(`/${getType()}/offers/${getCat()}`);

    const floorOffer = data?.offers
        .sort((a, b) => new BigNumber(a.price).comparedTo(b.price))[0];

    return {
        data: data,
        forceReload: forceReload,
        floorOffer: floorOffer
    };

    function getType() {
        return category === 'penguins' ? 'penguins' : 'items';
    }

    function getCat() {
        return category === 'penguins' || category == 'items' ? '' : category;
    }
}

export default useGetOffersOfCategory;