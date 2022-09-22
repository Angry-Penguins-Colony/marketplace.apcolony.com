import { IItem } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';

function useGetItem(id: string) {
    return useGenericAPICall<IItem[]>(`/penguin/${id}`);
}

export default useGetItem;