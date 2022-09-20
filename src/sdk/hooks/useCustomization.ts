import React from 'react';
import { Attributes, IItem } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { SimpleTransactionType } from '@elrondnetwork/dapp-core/types';
import BigNumber from 'bignumber.js';
import { customisationContractAddress, penguinCollection } from 'config';
import calculateCustomizeGasFees from 'sdk/transactionsBuilders/customize/calculateCustomizeGasFees';
import CustomizePayloadBuilder, { ItemToken } from 'sdk/transactionsBuilders/customize/CustomizePayloadBuilder';
import calculeRenderGasFees from 'sdk/transactionsBuilders/render/calculateRenderGasFees';
import { RenderPayloadBuilder } from 'sdk/transactionsBuilders/render/RenderPayloadBuilder';
import { PenguinItemsIdentifier, Utils as PenguinItemsIdentifierUtils } from 'sdk/types/PenguinItemsIdentifier';
import useGetAttributesStatus from './useGetAttributesStatus';
import { useGetOwnedItems, useGetOwnedPenguins } from './useGetOwned';

function useCustomization(selectedPenguinNonce: number, initialItemsIdentifier?: PenguinItemsIdentifier) {

    const [equippedItemsIdentifier, setEquippedItemsIdentifier] = React.useState<PenguinItemsIdentifier>(initialItemsIdentifier ?? {});

    const { address: connectedAddress } = useGetAccountInfo();

    const ownedItems = useGetOwnedItems();
    const ownedPenguins = useGetOwnedPenguins();

    const equippedItems = React.useMemo(() => parseAttributes(equippedItemsIdentifier), [equippedItemsIdentifier]);
    const attributesStatus = useGetAttributesStatus(equippedItems);

    const selectedPenguin = ownedPenguins?.find((penguin) => penguin.nonce === selectedPenguinNonce)

    React.useEffect(() => {

        if (initialItemsIdentifier) return;
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
        getCustomizeTransaction,
        getRenderTransaction,
        isSlotModified,
        setEquippedItemsIdentifier,
        equippedItemsIdentifier,
        attributesStatus,
        selectedPenguin,
        hasSomeModifications: isModified(),
    }

    function isSlotModified(slot: string) {
        return equippedItemsIdentifier[slot] !== selectedPenguin?.equippedItems[slot]?.identifier;
    }

    function isModified(): boolean {

        const penguinEquippedItems = PenguinItemsIdentifierUtils.from(selectedPenguin?.equippedItems || {});

        return !PenguinItemsIdentifierUtils.areEqual(penguinEquippedItems, equippedItemsIdentifier);
    }

    function parseAttributes(itemsIdentifiers: PenguinItemsIdentifier) {

        if (ownedItems === undefined) return;

        const _attributes = new Attributes();

        for (const slot in itemsIdentifiers) {
            const identifier = itemsIdentifiers[slot];
            if (identifier) {
                const item = getItem(identifier);
                if (item) {
                    _attributes.set(slot, item.name);
                }
            }
        }
        return _attributes;
    }

    function resetItems() {
        setEquippedItemsIdentifier({});
    }

    function equipItem(slot: string, item: IItem) {

        if (equippedItemsIdentifier[slot] == item.identifier) return;

        console.log('Equipped', item, 'at', slot);

        setEquippedItemsIdentifier({
            ...equippedItemsIdentifier,
            [slot]: item.identifier
        });
    }

    function unequipItem(slot: string) {
        if (equippedItemsIdentifier[slot] == undefined) return;

        console.log('Unequiped slot', slot);

        setEquippedItemsIdentifier({
            ...equippedItemsIdentifier,
            [slot]: undefined
        });
    }

    function getItem(identifier: string) {
        return ownedItems?.find(item => item.identifier === identifier);
    }


    function getRenderTransaction(): SimpleTransactionType {

        if (!equippedItems) throw new Error('Attributes are required');

        const payload = new RenderPayloadBuilder()
            .setAttributes(equippedItems)
            .build();

        const transaction: SimpleTransactionType = {
            value: new BigNumber('0.001e18').toString(), // 0.001 EGLD
            data: payload.toString(),
            receiver: customisationContractAddress.bech32(),
            gasLimit: calculeRenderGasFees(payload)
        };

        return transaction;
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