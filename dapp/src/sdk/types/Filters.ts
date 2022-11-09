import { IItem } from '@apcolony/marketplace-api/out';

export default interface Filters {
    items: {
        title: string;
        value: string;
        icon: string;
        attributes: {
            name: string;
            number: number;
            value: string;
            isSelected: boolean;
            isTmpSelected: boolean;
        }[];
    }[];
    selected: {
        name: string;
        value: string;
        number: number;
    }[];
}

export function matchFilter(filters: Filters, item: FilterableItem): boolean {

    if (!item.equippedItems) return false;

    for (const selectedElement of filters.selected) {

        // is the attribute in a filter?
        const currentAttribute = getItem(item.equippedItems, selectedElement.value);
        if (!currentAttribute) return false;

        // is the attribute the same value?
        const currentFilter = filters.items.find((filter) => filter.value === currentAttribute.slot);
        if (!currentFilter) return false;

        const isCurrentAttributeSelected = currentFilter.attributes.find((attr) => {
            return attr.name === currentAttribute.attributeName && attr.isSelected === true;
        });

        if (!isCurrentAttributeSelected) {
            return false;
        }
    }

    return true;
}

interface FilterableItem {
    equippedItems: { [key: string]: IItem; },
}

function getItem(equippedItems: { [key: string]: IItem; }, slot: string) {
    return Object.values(equippedItems)
        .find(i => i.slot == slot);
}