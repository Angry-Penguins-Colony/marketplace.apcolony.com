import { IPenguin } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';

function useGetPenguin(id: string) {
    return useGenericAPICall<IPenguin[]>(`/penguin/${id}`);
}

export default useGetPenguin;