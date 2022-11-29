import React from 'react';
import { IPenguin } from '@apcolony/marketplace-api';
import { GenericFiltersPopup } from '../GenericFiltersPopup';

export const PenguinsFiltersPopup = (props: {
    elements: IPenguin[];
    onFilterChanged?: (elements: IPenguin[]) => void;
}) => {


    return <GenericFiltersPopup
        filters={[]}
        {...props}
    />
}