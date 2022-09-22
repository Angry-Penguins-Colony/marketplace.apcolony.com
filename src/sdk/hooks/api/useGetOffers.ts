import { IOffer } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';

function useGetOffers(type: 'penguins' | 'items', id: string) {
    return useGenericAPICall<IOffer[]>(`/offers/${type}/${id}`);
}

export default useGetOffers;