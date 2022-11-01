import { IMarketData } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';

function useGetMarketData(category: 'penguins' | string) {

    const url = category == 'penguins' ?
        '/penguins/offers/stats' :
        `/items/offers/${category}/stats`;

    return useGenericAPICall<IMarketData>(url);
}

export default useGetMarketData;