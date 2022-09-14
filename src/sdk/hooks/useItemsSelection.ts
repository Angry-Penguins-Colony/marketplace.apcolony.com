import React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { PenguinItemsIdentifier } from 'sdk/types/PenguinItemsIdentifier';

function useItemsSelection() {
    const [selectedItemsInPopup, setSelectedItemsInPopup] = React.useState<PenguinItemsIdentifier>({});

    function unselect(item: IItem) {
        setSelectedItemsInPopup({
            ...selectedItemsInPopup,
            [item.slot]: undefined
        });
    }

    function select(item: IItem) {
        setSelectedItemsInPopup({
            ...selectedItemsInPopup,
            [item.slot]: item.identifier
        });
    }


    function toggle(item: IItem) {
        const isSelected = selectedItemsInPopup[item.slot] === item.identifier;

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
        setSelectedItemsInPopup,
        selectedItemsInPopup
    }
}

export default useItemsSelection;