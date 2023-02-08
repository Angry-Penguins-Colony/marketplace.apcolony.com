import { INewSaleData } from '@apcolony/marketplace-api'
import useGenericAPICall from './useGenericAPICall'

export default function useGetNewSaleInfo(id: string) {
    console.log('Getting new sale id #' + id)

    return useGenericAPICall<INewSaleData>('new-sale/' + id)
}