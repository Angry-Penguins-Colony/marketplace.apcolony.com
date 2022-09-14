import React from 'react';
import { Attributes, IItem } from '@apcolony/marketplace-api';
import { PenguinItemsIdentifier } from 'sdk/types/PenguinItemsIdentifier';
import useGetAttributesStatus from './useGetAttributesStatus';
import { useGetOwnedItems, useGetOwnedPenguins } from './useGetOwned';

function useCustomization(selectedPenguinNonce: number) {

    const [equippedItemsIdentifier, setEquippedItemsIdentifier] = React.useState<PenguinItemsIdentifier>({});
    const [attributes, setAttributes] = React.useState<Attributes | undefined>(undefined);

    const ownedItems = useGetOwnedItems();
    const ownedPenguins = useGetOwnedPenguins();
    const attributesStatus = useGetAttributesStatus(attributes);

    const selectedPenguin = ownedPenguins?.find((penguin) => penguin.nonce === selectedPenguinNonce);

    React.useEffect(() => {

        const _attributes = new Attributes();

        for (const slot in equippedItemsIdentifier) {
            const identifier = equippedItemsIdentifier[slot];
            if (identifier) {
                const item = getItem(identifier);
                if (item) {
                    _attributes.set(slot, item.name);
                }
            }
        }

        setAttributes(_attributes);
    }, [equippedItemsIdentifier]);

    React.useEffect(() => {

        if (!selectedPenguin) return;

        const equippedItemsIdentifierFromFetchedData = Object.values(selectedPenguin.equippedItems)
            .reduce((acc, item) => {
                acc[item.slot] = item.identifier;
                return acc;
            }, {} as PenguinItemsIdentifier);

        setEquippedItemsIdentifier(equippedItemsIdentifierFromFetchedData);

    }, [selectedPenguin]);

    return {
        resetItems,
        equipItem,
        unequipItem,
        equippedItemsIdentifier,
        attributesStatus,
        ownedItems,
        ownedPenguins,
        selectedPenguin
    }

    function resetItems() {
        setEquippedItemsIdentifier({});
    }

    function equipItem(slot: string, item: IItem) {

        if (equippedItemsIdentifier[slot] == item.identifier) return;

        setEquippedItemsIdentifier({
            ...equippedItemsIdentifier,
            [slot]: item.identifier
        });
    }

    function unequipItem(slot: string) {
        if (equippedItemsIdentifier[slot] == undefined) return;

        setEquippedItemsIdentifier({
            ...equippedItemsIdentifier,
            [slot]: undefined
        });
    }

    function getItem(identifier: string) {
        return ownedItems?.find(item => item.identifier === identifier);
    }

}

export default useCustomization;