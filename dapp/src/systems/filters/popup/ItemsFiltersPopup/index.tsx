import React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { ItemsTier } from 'systems/filters/components/items/tier';
import { GenericFiltersPopup } from '../GenericFiltersPopup';


export const ItemsFiltersPopup = (props: {
    elements: IItem[];
    onFilterChanged?: (elements: IItem[]) => void;
}) => {

    return <GenericFiltersPopup
        filters={[ItemsTier]}
        {...props}
    />

}