import React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { PenguinItemsIdentifier } from 'sdk/types/PenguinItemsIdentifier';

function useItemsSelection() {
    const [selectedItems, setSelectedItems] = React.useState<PenguinItemsIdentifier>({});

    function unselect(item: IItem) {
        setSelectedItems({
            ...selectedItems,
            [item.slot]: undefined
        });
    }

    function select(item: IItem) {
        setSelectedItems({
            ...selectedItems,
            [item.slot]: item.identifier
        });
    }


    function toggle(item: IItem) {
        const isSelected = selectedItems[item.slot] === item.identifier;

        if (isSelected) {
            unselect(item);
        }
        else {
            select(item);
        }
    }

    return {
        unselect,
        select,
        toggle,
        setSelectedItems,
        selectedItems
    }
}

export default useItemsSelection;