import { IItem, IOffer } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';

interface Output {
    offers: IOffer[];
    associatedItems: IItem[];
}

function useGetOffers(category: 'penguins' | string) {
    return useGenericAPICall<Output>(`/${getType()}/offers/${getCat()}`);

    function getType() {
        return category === 'penguins' ? 'penguins' : 'items';
    }

    function getCat() {
        return category === 'penguins' ? '' : category;
    }
}

export default useGetOffers;