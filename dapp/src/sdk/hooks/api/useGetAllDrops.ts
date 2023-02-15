import { IDropData } from '@apcolony/marketplace-api'
import useGenericAPICall from './useGenericAPICall'

export default function useGetAllDrops() {
    const { data: allDrops } = useGenericAPICall<IDropData[]>('drops/all');

    const validDrops = allDrops?.filter(drop => drop.maxSupply > 0);

    return {
        allDrops,
        soldoutDrops: validDrops?.filter(drop => drop.remainingSupply == 0),
        currentDrops: validDrops?.filter(drop => drop.remainingSupply > 0),
    }
}