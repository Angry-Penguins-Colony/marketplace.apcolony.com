import { IGenericElement } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import useGenericAPICall, { IGenericAPIOptions } from 'sdk/hooks/api/useGenericAPICall';
import CategoriesType from 'sdk/types/CategoriesType';

interface IGenericElementOwned extends IGenericElement {
    ownedAmount?: number;
}

export function useGetGenericItem(type: CategoriesType, id: string, options?: IGenericAPIOptions) {

    const { address } = useGetAccountInfo();

    const url = `${type}/${getSingular()}/${id}` + (address != '' ? `?owner=${address}` : '');
    const raw = useGenericAPICall<IGenericElementOwned>(url, options);

    return raw;

    function getSingular() {
        switch (type) {
            case 'penguins':
                return 'penguin';

            case 'items':
                return 'item';

            case 'eggs':
                return 'egg';

            default:
                throw new Error('Invalid type');
        }
    }
}
