import { IDropData } from '@apcolony/marketplace-api'
import useGenericAPICall from './useGenericAPICall'

export default function useGetNewSaleInfo(id: string) {
    return useGenericAPICall<IDropData>('drops/drop/' + id)
}