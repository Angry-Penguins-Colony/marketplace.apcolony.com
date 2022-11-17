import { IActivity } from '@apcolony/marketplace-api';
import CategoriesType from 'sdk/types/CategoriesType';
import useGenericAPICall, { IGenericAPIOptions } from './useGenericAPICall';

function useGetActivity(type: CategoriesType, id: string, options?: IGenericAPIOptions) {
    return useGenericAPICall<IActivity[]>(`/activities/${type}/${id}`, options);
}

export default useGetActivity;