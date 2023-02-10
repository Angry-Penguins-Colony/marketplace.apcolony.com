import { INewSaleData } from '@apcolony/marketplace-api'
import useGenericAPICall from './useGenericAPICall'

export default function useGetNewSaleInfo(id: string) {
    return useGenericAPICall<INewSaleData>('new-sale/' + id)
}