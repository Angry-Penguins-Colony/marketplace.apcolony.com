import { ElementType } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';


interface OutputPenguin {
    id: string;
    displayName: string;
    rank: number;
    thumbnailUrls: {
        /**
         * 1024x1204px
         */
        high: string;
        /**
         * 512x512px
         */
        small: string;
    };
}

export function useGetRanks(category: ElementType, start: number, size: number, search?: string) {
    if (category != 'penguins')
        throw new Error('Only penguins are supported');

    return useGenericAPICall<OutputPenguin[]>(`/penguins/ranks?start=${start}&size=${size}&search=${search || ''}`);
}