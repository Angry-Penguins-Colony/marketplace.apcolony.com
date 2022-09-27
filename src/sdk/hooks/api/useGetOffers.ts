import { IOffer } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';


function useGetOffers(category: 'penguins' | 'items', id: string) {

    return useGenericAPICall<IOffer[]>(`/${category}/offer/${id}`);
}

export default useGetOffers;