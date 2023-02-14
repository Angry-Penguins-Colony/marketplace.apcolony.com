import { IDropData } from '@apcolony/marketplace-api'
import useGenericAPICall from './useGenericAPICall'

export default function useGetAllDrops() {
    return useGenericAPICall<IDropData[]>('drops/all');
}