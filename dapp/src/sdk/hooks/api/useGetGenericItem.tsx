import { IGenericElement } from '@apcolony/marketplace-api';
import useGenericAPICall, { IGenericAPIOptions } from 'sdk/hooks/api/useGenericAPICall';
import CategoriesType from 'sdk/types/CategoriesType';

export function useGetGenericItem(type: CategoriesType, id: string, options?: IGenericAPIOptions) {

    const singularType = type == 'penguins' ? 'penguin' : 'item';
    const raw = useGenericAPICall<IGenericElement>(`${type}/${singularType}/${id}`, options);

    return raw;
}
