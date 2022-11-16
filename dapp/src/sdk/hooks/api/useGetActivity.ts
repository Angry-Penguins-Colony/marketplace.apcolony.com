import { IActivity } from '@apcolony/marketplace-api';
import CategoriesType from 'sdk/types/CategoriesType';
import useGenericAPICall, { IGenericAPIOptions } from './useGenericAPICall';

function useGetActivity(type: CategoriesType, id: string, options?: IGenericAPIOptions) {
    return useGenericAPICall<IActivity[]>(`/${type}/activity/${id}`, options);
}

export default useGetActivity;