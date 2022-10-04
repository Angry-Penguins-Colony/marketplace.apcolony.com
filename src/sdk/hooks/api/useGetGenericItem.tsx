import { IGenericElement } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import useGenericAPICall from 'sdk/hooks/api/useGenericAPICall';
import CategoriesType from 'sdk/types/CategoriesType';

export function useGetGenericItem(type: CategoriesType, id: string) {

    const { address } = useGetAccountInfo();

    const singularType = type == 'penguins' ? 'penguin' : 'item';
    const raw = useGenericAPICall<IGenericElement>(`${type}/${singularType}/${id}` + (address != '' ? `?owner=${address}` : ''));

    return raw;
}
