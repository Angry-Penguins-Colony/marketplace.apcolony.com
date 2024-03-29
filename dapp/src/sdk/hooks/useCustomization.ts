import React from 'react';
import { Attributes, IItem, IOwnedItem, IPenguin } from '@apcolony/marketplace-api';
import { Address } from '@multiversx/sdk-core/out';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { SimpleTransactionType } from '@multiversx/sdk-dapp/types';
import BigNumber from 'bignumber.js';
import { customisationContractAddress, itemsDatabase, penguinCollection } from 'config';
import { capitalize } from 'sdk/conversion/string';
import { splitIdentifier } from 'sdk/conversion/tokenIdentifier';
import CustomizePayloadBuilder, { ItemToken } from 'sdk/transactionsBuilders/customize/CustomizePayloadBuilder';
import calculeRenderGasFees from 'sdk/transactionsBuilders/render/calculateRenderGasFees';
import { RenderPayloadBuilder } from 'sdk/transactionsBuilders/render/RenderPayloadBuilder';
import { PenguinItemsIdentifier, Utils as PenguinItemsIdentifierUtils } from 'sdk/types/PenguinItemsIdentifier';
import useGetAttributesStatus from './api/useGetAttributesStatus';
import { useGetGenericItem } from './api/useGetGenericItem';
import useGetUserOwnedAmount from './api/useGetUserOwnedAmount';
import { CustomizeTransactionFilter } from './transactionsFilters/filters';
import useGetOnNewPendingTransaction from './useGetOnTransactionPending';
import useGetOnTransactionSuccesful from './useGetOnTransactionSuccesful';
import usePrevious from './usePrevious';

const periodicRefreshMS = 10_000;

function useCustomization(selectedPenguinId: string, initialItemsIdentifier?: PenguinItemsIdentifier) {

    const [equippedItemsIdentifier, setEquippedItemsIdentifier] = React.useState<PenguinItemsIdentifier>(initialItemsIdentifier ?? {});
    const [ownedAndEquippedItems, setOwnedAndEquippedItems] = React.useState<IOwnedItem[] | undefined>(undefined);
    const [isCustomizationPending, setIsCustomizationPending] = React.useState(false);

    const { address: connectedAddress } = useGetAccountInfo();

    const owned = useGetUserOwnedAmount(Address.fromBech32(connectedAddress));
    const ownedItems = owned?.items;
    const { data, forceReload: reloadSelectedPenguin } = useGetGenericItem('penguins', selectedPenguinId);
    const selectedPenguin = data as IPenguin | undefined;
    const previousSelectedPenguin = usePrevious(data);


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

        resetItems();

    }, [selectedPenguin]);


    React.useEffect(() => {
        updateOwnedAndEquippedItems();
    }, [selectedPenguin, ownedItems]);

    const doUserOwnSelectedPenguin = selectedPenguin && selectedPenguin.owner == connectedAddress;
    return {
        resetItems: resetItems,
        equipItem,
        unequipItem,
        getCustomizeTransaction,
        getRenderTransaction,
        isSlotModified,
        setEquippedItemsIdentifier,
        unequipAllItems,
        isCustomizationPending,
        equippedItemsIdentifier,
        attributesStatus,
        selectedPenguin,
        hasSomeModifications: isModified(),
        ownedAndEquippedItems,
        doUserOwnSelectedPenguin
    }

    function updateOwnedAndEquippedItems() {
        if (!selectedPenguin || !ownedItems) return;


        const _ownedAndEquippedItems =
            [
                ...Object.values(selectedPenguin.equippedItems)
                    .map(item => ({
                        ...item,
                        ownedAmount: 1
                    })),
                ...ownedItems
            ]
                .filter((item, index, self) => self.findIndex(i => i.id == item.id) == index); // remove duplicates

        setOwnedAndEquippedItems(_ownedAndEquippedItems);
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
                const item = itemsDatabase.getItemFromIdentifier(identifier);

                if (item) {
                    _attributes.set(slot, item.attributeName);
                }
                else {
                    console.error(`Could not find item with identifier ${identifier}`);
                }
            }
        }

        return _attributes;
    }

    function equipItem(slot: string, item: IItem) {

        if (equippedItemsIdentifier[slot] == item.identifier) return;

        console.log('Equipped', item.displayName, 'at', slot);

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
            .setName(selectedPenguin.displayName)
            .build();

        console.log(payload.toString())

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

            if (itemIdentifier != blockchainCurrentlyEquippedItem) {
                if (itemIdentifier == undefined) {
                    slotsToUnequip.push(capitalize(slot));
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

        return transaction;
    }

    function unequipAllItems() {
        setEquippedItemsIdentifier({});
    }

    function resetItems() {
        if (!selectedPenguin) return;

        const equippedItemsIdentifierFromFetchedData = Object.values(selectedPenguin.equippedItems)
            .reduce((acc, item) => {
                acc[item.slot] = item.identifier;
                return acc;
            }, {} as PenguinItemsIdentifier);

        setEquippedItemsIdentifier(equippedItemsIdentifierFromFetchedData);
    }
}

export default useCustomization;