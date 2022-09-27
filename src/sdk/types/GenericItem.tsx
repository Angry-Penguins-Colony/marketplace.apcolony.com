import { IItem } from '@apcolony/marketplace-api';

export interface GenericItem {
    name: string;
    thumbnail: string;
    items: IItem[];
    rank: number;
    price: number;
    amount: number;
}
