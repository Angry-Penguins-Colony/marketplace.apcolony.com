import React from 'react';
import { Attributes, IItem } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { SimpleTransactionType } from '@elrondnetwork/dapp-core/types';
import { customisationContractAddress, penguinCollection } from 'config';
import calculateCustomizeGasFees from 'sdk/transactionsBuilders/customize/calculateCustomizeGasFees';
import CustomizePayloadBuilder, { ItemToken } from 'sdk/transactionsBuilders/customize/CustomizePayloadBuilder';
import { PenguinItemsIdentifier } from 'sdk/types/PenguinItemsIdentifier';
import useGetAttributesStatus from './useGetAttributesStatus';
import { useGetOwnedItems, useGetOwnedPenguins } from './useGetOwned';

function useCustomization(selectedPenguinNonce: number) {

    const [equippedItemsIdentifier, setEquippedItemsIdentifier] = React.useState<PenguinItemsIdentifier>({});
    const [attributes, setAttributes] = React.useState<Attributes | undefined>(undefined);

    const { address: connectedAddress } = useGetAccountInfo();

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
        selectedPenguin,
        getCustomizeTransaction
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

    function getCustomizeTransaction(): SimpleTransactionType {
        const itemsToEquip: ItemToken[] = [];
        const slotsToUnequip: string[] = [];

        for (const slot in equippedItemsIdentifier) {
            const itemIdentifier = equippedItemsIdentifier[slot];
            const blockchainCurrentlyEquippedItem = selectedPenguin?.equippedItems[slot]?.identifier;

            if (itemIdentifier != blockchainCurrentlyEquippedItem) {
                if (itemIdentifier == undefined) {
                    slotsToUnequip.push(slot);
                }
                else {
                    const itemData = getItem(itemIdentifier);

                    if (!itemData)
                        throw new Error(`Item ${itemIdentifier} not found in owned items.`);

                    itemsToEquip.push({
                        collection: itemData?.identifier,
                        nonce: itemData?.nonce
                    });
                }
            }
        }


        const payload = new CustomizePayloadBuilder()
            .setCustomizationContractAddress(customisationContractAddress)
            .setPenguinCollection(penguinCollection)
            .setPenguinNonce(selectedPenguinNonce)
            .setItemsToEquip(itemsToEquip)
            .setSlotsToUnequip(slotsToUnequip)
            .build();

        const transaction: SimpleTransactionType = {
            value: '0',
            data: payload.toString(),
            receiver: connectedAddress,
            gasLimit: calculateCustomizeGasFees()
        };

        console.log(`Found ${itemsToEquip.length} items to equip and ${slotsToUnequip.length} slots to unequip.`);

        return transaction;
    }

}

export default useCustomization;