import { IOffer } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';

function useGetOffers(type: 'penguins' | 'items', id: string) {
    return useGenericAPICall<IOffer[]>(`/${type}/offers/${id}`);
}

export default useGetOffers;