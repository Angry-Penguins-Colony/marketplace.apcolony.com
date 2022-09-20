import React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { PenguinItemsIdentifier } from 'sdk/types/PenguinItemsIdentifier';

interface Options {
    initialSelectedItems?: PenguinItemsIdentifier,
    onSelectionChange?: () => void
}

function useItemsSelection({
    initialSelectedItems = {},
    onSelectionChange = () => { /* do nothing */ }
}: Options) {
    const [selectedItems, setSelectedItems] = React.useState<PenguinItemsIdentifier>(initialSelectedItems);

    const [dirty, setDirty] = React.useState(false);

    React.useEffect(() => {
        if (dirty) {
            console.log('dirty is true');
            onSelectionChange();
            setDirty(false);
        }
    });

    return {
        unselect,
        select,
        toggle,
        setSelectedItems,
        selectedItems
    };


    function unselect(item: IItem) {
        setSelectedItems({
            ...selectedItems,
            [item.slot]: undefined
        });
        setDirty(true);
    }

    function select(item: IItem) {
        setSelectedItems({
            ...selectedItems,
            [item.slot]: item.identifier
        });
        setDirty(true);
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
}

export default useItemsSelection;