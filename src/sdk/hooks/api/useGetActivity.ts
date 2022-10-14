import { IActivity } from '@apcolony/marketplace-api';
import useGenericAPICall, { IGenericAPIOptions } from './useGenericAPICall';

function useGetActivity(type: 'penguins' | 'items', id: string, options?: IGenericAPIOptions) {
    return useGenericAPICall<IActivity[]>(`/${type}/activity/${id}`, options);
}

export default useGetActivity;