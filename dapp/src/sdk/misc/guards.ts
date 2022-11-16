import { itemsDatabase, penguinsCount, slots } from 'config';
import CategoriesType, { categoriesTypeValues } from 'sdk/types/CategoriesType';

export function isIdValid(rawId: string, category: CategoriesType): boolean {

    switch (category) {
        case 'items':
            return itemsDatabase.idExist(rawId);

        case 'penguins':
            const id = parseInt(rawId);
            return isNaN(id) == false && id > 0 && id <= penguinsCount;

        case 'eggs':
            return rawId == 'silver' || rawId == 'gold' || rawId == 'diamond';

        default:
            console.warn(`Unknown type "${category}"`);
            return false;
    }
}

export function isCategoryValid(category: string) {
    return categoriesTypeValues.includes(category);
}

export function isOfferCategoryValid(category: string) {
    const validCategories = [
        'penguins',
        'hat',
        'beak',
        'skin',
        'weapon',
        'background',
        'eyes',
        'clothes'
    ];

    return validCategories.includes(category);
}

export function isSlot(slot: string): boolean {
    return slots.includes(slot);
}