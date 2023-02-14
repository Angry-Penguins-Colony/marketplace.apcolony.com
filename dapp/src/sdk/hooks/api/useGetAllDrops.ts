import { IDropData } from '@apcolony/marketplace-api'
import useGenericAPICall from './useGenericAPICall'

export default function useGetAllDrops() {
    const { data: allDrops } = useGenericAPICall<IDropData[]>('drops/all');


    return {
        allDrops,
        soldoutDrops: allDrops?.filter(drop => drop.remainingSupply == 0),
        currentDrops: allDrops?.filter(drop => drop.remainingSupply > 0),
    }
}