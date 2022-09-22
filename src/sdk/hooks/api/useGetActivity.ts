import { IActivity } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';

function useGetActivity(type: 'penguins' | 'items', id: string) {
    return useGenericAPICall<IActivity[]>(`/activity/${type}/${id}`);
}

export default useGetActivity;