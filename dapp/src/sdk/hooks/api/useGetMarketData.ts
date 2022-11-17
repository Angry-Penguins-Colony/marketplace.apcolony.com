import { ElementType, IMarketData } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';

function useGetMarketData(category: ElementType, slot?: string) {

    return useGenericAPICall<IMarketData>(getUrl());

    function getUrl() {
        if (slot) {
            return `/offers/${category}/${slot}/stats`;
        } else {
            return `/offers/${category}/stats`;
        }
    }
}

export default useGetMarketData;