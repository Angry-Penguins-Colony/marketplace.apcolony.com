import { IItem } from '@apcolony/marketplace-api';
import CategoriesType from './CategoriesType';

export interface GenericItem {
    id: string;
    type: CategoriesType;

    name: string;
    thumbnail: string;

    collection: string;
    nonce: number;

    floorPrice?: number;
    rank: number;

    items?: IItem[];
    amount?: number;
    owner?: string;
}
