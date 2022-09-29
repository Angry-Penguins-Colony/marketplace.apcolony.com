import { IItem, IOffer } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';

interface Output {
    offers: IOffer[];
    associatedItems: IItem[];
}

function useGetOffersOfCategory(category: 'penguins' | string) {

    const output = useGenericAPICall<Output>(`/${getType()}/offers/${getCat()}`);

    return output;

    function getType() {
        return category === 'penguins' ? 'penguins' : 'items';
    }

    function getCat() {
        return category === 'penguins' ? '' : category;
    }
}

export default useGetOffersOfCategory;