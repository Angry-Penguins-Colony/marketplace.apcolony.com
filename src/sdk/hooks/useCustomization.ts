import React from 'react';
import { Attributes, IItem, IPenguin } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { SimpleTransactionType } from '@elrondnetwork/dapp-core/types';
import BigNumber from 'bignumber.js';
import { customisationContractAddress, penguinCollection } from 'config';
import { splitIdentifier } from 'sdk/conversion/tokenIdentifier';
import { identifierToItem } from 'sdk/misc/dbHelper';
import CustomizePayloadBuilder, { ItemToken } from 'sdk/transactionsBuilders/customize/CustomizePayloadBuilder';
import calculeRenderGasFees from 'sdk/transactionsBuilders/render/calculateRenderGasFees';
import { RenderPayloadBuilder } from 'sdk/transactionsBuilders/render/RenderPayloadBuilder';
import { PenguinItemsIdentifier, Utils as PenguinItemsIdentifierUtils } from 'sdk/types/PenguinItemsIdentifier';
import useGetAttributesStatus from './api/useGetAttributesStatus';
import { useGetGenericItem } from './api/useGetGenericItem';
import { useGetOwnedItems } from './api/useGetOwned';
import useGetUserOwnedAmount from './api/useGetUserOwnedAmount';
import { CustomizeTransactionFilter } from './transactionsFilters/filters';
import useGetOnNewPendingTransaction from './useGetOnTransactionPending';
import useGetOnTransactionSuccesful from './useGetOnTransactionSuccesful';
import usePrevious from './usePrevious';

const periodicRefreshMS = 10_000;

function useCustomization(selectedPenguinId: string, initialItemsIdentifier?: PenguinItemsIdentifier) {

    const [equippedItemsIdentifier, setEquippedItemsIdentifier] = React.useState<PenguinItemsIdentifier>(initialItemsIdentifier ?? {});
    const [ownedAndEquippedItems, setOwnedAndEquippedItems] = React.useState<IItem[] | undefined>(undefined);
    const [isCustomizationPending, setIsCustomizationPending] = React.useState(false);

    const { address: connectedAddress } = useGetAccountInfo();

    const ownedItems = useGetOwnedItems();
    const { data, forceReload: reloadSelectedPenguin } = useGetGenericItem('penguins', selectedPenguinId);
    const selectedPenguin = data as IPenguin | undefined;
    const previousSelectedPenguin = usePrevious(data);

    const ownedAmount = useGetUserOwnedAmount();

    const equippedItems = parseAttributes(equippedItemsIdentifier);
    const { attributesStatus } = useGetAttributesStatus(equippedItems, selectedPenguinId);

    useGetOnNewPendingTransaction(() => {
        setIsCustomizationPending(true)
    }, new CustomizeTransactionFilter())

    useGetOnTransactionSuccesful(() => {
        reloadSelectedPenguin();
    }, new CustomizeTransactionFilter());

    // useGetOnTransactionSuccesful with customize works half the time, 
    // so we also use a periodic check
    React.useEffect(() => {
        if (isCustomizationPending == true) {
            const interval = setInterval(() => {
                console.log('check')
                reloadSelectedPenguin();
            }, periodicRefreshMS);

            return () => clearInterval(interval);
        }
    }, [isCustomizationPending])

    // when the selected penguin is updated, the customisation pending flag is reset
    React.useEffect(() => {
        if (isCustomizationPending && isModified() == false) {
            setIsCustomizationPending(false);
        }
    }, [selectedPenguin, previousSelectedPenguin])

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


    React.useEffect(() => {

        if (selectedPenguin && ownedItems) {

            const uniqueIds = new Set(
                [
                    ...Object.values(selectedPenguin.equippedItems)
                        .map(item => item.id),
                    ...ownedItems
                        .map(i => i.id)
                ]);

            const _ownedAndEquippedItems = Array.from(uniqueIds).map(id => {
                return {
                    ...ownedItems.find(i => i.id == id),
                    ...Object.values(selectedPenguin.equippedItems).find(i => i.id == id),
                };
            }) as IItem[];

            setOwnedAndEquippedItems(_ownedAndEquippedItems);
        }
    }, [selectedPenguin, ownedItems]);

    const doUserOwnSelectedPenguin = selectedPenguin && selectedPenguin.owner == connectedAddress;
    return {
        resetItems,
        equipItem,
        unequipItem,
        getCustomizeTransaction,
        getRenderTransaction,
        isSlotModified,
        setEquippedItemsIdentifier,
        isCustomizationPending,
        equippedItemsIdentifier,
        attributesStatus,
        selectedPenguin,
        hasSomeModifications: isModified(),
        ownedItemsAmount: ownedAmount?.items,
        ownedAndEquippedItems,
        doUserOwnSelectedPenguin
    }

    function isSlotModified(slot: string) {
        return equippedItemsIdentifier[slot] !== selectedPenguin?.equippedItems[slot]?.identifier;
    }

    function isModified(): boolean {

        const penguinEquippedItems = PenguinItemsIdentifierUtils.from(selectedPenguin?.equippedItems || {});

        return !PenguinItemsIdentifierUtils.areEqual(penguinEquippedItems, equippedItemsIdentifier);
    }

    function parseAttributes(itemsIdentifiers: PenguinItemsIdentifier) {
        const _attributes = new Attributes();

        for (const slot in itemsIdentifiers) {
            const identifier = itemsIdentifiers[slot];

            if (identifier) {
                const item = identifierToItem(identifier);

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

    function getRenderTransaction(): SimpleTransactionType {

        if (!equippedItems) throw new Error('Attributes are required');
        if (!selectedPenguin) throw new Error('Selected penguin is required');

        const payload = new RenderPayloadBuilder()
            .setAttributes(equippedItems)
            .setName(selectedPenguin.name)
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

        if (!selectedPenguin) throw new Error('Selected penguin is required');

        const itemsToEquip: ItemToken[] = [];
        const slotsToUnequip: string[] = [];

        const slots = new Set([...Object.keys(equippedItemsIdentifier), ...Object.keys(selectedPenguin.equippedItems || {})]);

        for (const slot of Array.from(slots)) {
            const itemIdentifier = equippedItemsIdentifier[slot];
            const blockchainCurrentlyEquippedItem = selectedPenguin.equippedItems[slot]?.identifier;

            console.log(itemIdentifier, 'vs', blockchainCurrentlyEquippedItem);

            if (itemIdentifier != blockchainCurrentlyEquippedItem) {
                if (itemIdentifier == undefined) {
                    slotsToUnequip.push(slot);
                }
                else {
                    const { collection, nonce } = splitIdentifier(itemIdentifier);

                    itemsToEquip.push({
                        collection: collection,
                        nonce: nonce
                    });
                }
            }
        }

        const payloadBuilder = new CustomizePayloadBuilder()
            .setCustomizationContractAddress(customisationContractAddress)
            .setPenguinCollection(penguinCollection)
            .setPenguinNonce(selectedPenguin.nonce)
            .setItemsToEquip(itemsToEquip)
            .setSlotsToUnequip(slotsToUnequip)

        const transaction: SimpleTransactionType = {
            value: '0',
            data: payloadBuilder.build().toString(),
            receiver: connectedAddress,
            gasLimit: payloadBuilder.gesGasLimit()
        };

        console.log(`Found ${itemsToEquip.length} items to equip and ${slotsToUnequip.length} slots to unequip.`);

        return transaction;
    }

}

export default useCustomization;