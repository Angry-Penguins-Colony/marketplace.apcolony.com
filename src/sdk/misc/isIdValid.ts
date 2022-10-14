import { items, penguinsCount } from 'config';
import CategoriesType from 'sdk/types/CategoriesType';

export function isIdValid(rawId: string, category: CategoriesType): boolean {

    switch (category) {
        case 'items':
            return items.some(item => item.id == rawId);

        case 'penguins':
            const id = parseInt(rawId);
            return isNaN(id) == false && id > 0 && id <= penguinsCount;

        default:
            throw new Error('Unknown type');
    }
}
