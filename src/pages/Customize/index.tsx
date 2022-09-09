import * as React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { useParams } from 'react-router-dom';
import Button from 'components/Button/Button';
import RefreshIcon from 'components/Icons/RefreshIcon';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import { customisationContractAddress, ipfsGateway, penguinCollection } from 'config';
import { useGetOwnedItems, useGetOwnedPenguins } from 'sdk/hooks/useGetOwned';
import CustomizePayloadBuilder, { ItemToken } from 'sdk/transactionsPayload/CustomizePayloadBuilder';
import style from './customize.module.scss';
import GoToAnotherPenguin from './GoToAnotherPenguin';
import PopupFromBottom from './PopupFromBottom';
import PenguinRender from './Render';

type PenguinItemsIdentifier = Record<string, string | undefined>;

const Customize = () => {
    const { id } = useParams();
    const selectedPenguinNonce = parseInt(id ?? '');
    const ownedPenguins = useGetOwnedPenguins();
    const selectedPenguinData = ownedPenguins?.find((penguin) => penguin.nonce === selectedPenguinNonce);

    const [equippedItemsIdentifier, setEquippedItemsIdentifier] = React.useState<PenguinItemsIdentifier>({});

    React.useEffect(() => {

        if (!selectedPenguinData) return;

        const equippedItemsIdentifierFromFetchedData = Object.values(selectedPenguinData.equippedItems)
            .reduce((acc, item) => {
                acc[item.slot] = item.identifier;
                return acc;
            }, {} as PenguinItemsIdentifier);

        setEquippedItemsIdentifier(equippedItemsIdentifierFromFetchedData);
        setSelectedItemsInPopup(equippedItemsIdentifierFromFetchedData);
    }, [selectedPenguinData]);


    /* Choose items popup */
    const [itemsPopupIsOpen, setItemsPopupIsOpen] = React.useState<boolean>(false);
    const [itemsPopupTitle, setItemsPopupTitle] = React.useState<string>('All My Items');
    const [itemsPopupType, setItemsPopupType] = React.useState<string>('all');
    const [itemsInPopup, setItemsInPopup] = React.useState<IItem[]>([]);
    const [selectedItemsInPopup, setSelectedItemsInPopup] = React.useState<PenguinItemsIdentifier>({});

    const ownedItems = useGetOwnedItems();

    if (!isSelectedNonceOwned() && ownedPenguins && ownedPenguins.length > 0) {
        window.location.href = `/customize/${ownedPenguins[0].nonce}`;
    }

    React.useEffect(() => {
        // change inlive if it's desktop version
        if (window.innerWidth > 800) {
            for (const slot in selectedItemsInPopup) {
                validateItemChangement(slot);
            }
        }
    }, [selectedItemsInPopup]);

    React.useEffect(() => {
        if (ownedItems) {
            setItemsInPopup(ownedItems);
        }
    }, [ownedItems]);

    function getImageSrcToRender(slot: keyof PenguinItemsIdentifier) {
        const item = getEquippedItemInSlot(slot);

        if (item != undefined) {

            if (!item.renderCID) throw new Error(`Item ${item.name} in slot ${slot} has no renderCID.`);

            return ipfsGateway + item.renderCID;
        }
        else {
            return undefined;
        }
    }

    return (
        <div id={style['body-content']}>
            <MobileHeader title="Customize" subTitle={'Penguin #' + selectedPenguinNonce} className={style['mobile-header']} />
            <PopupFromBottom
                title={itemsPopupTitle}
                type={itemsPopupType}
                isOpen={itemsPopupIsOpen}
                items={itemsInPopup}
                selectedItemsIdentifier={selectedItemsInPopup}
                onItemClick={onItemClick}
                cancel={() => { setItemsPopupIsOpen(false); }}
                select={validateItemChangement}
                changeType={(type) => {
                    openItemsPopup(type, 'Select ' + type);
                }}
            />
            <section className={style.customize}>
                <div className={style.content}>
                    <div className={style.items}>
                        {createItemButton('hat', 'Hats')}
                        {createItemButton('eyes', 'Eyes')}
                        {createItemButton('clothes', 'Clothes')}
                    </div>
                    {/* TODO: REFACTOR: too much repetitive */}
                    <PenguinRender items={{
                        background: getImageSrcToRender('background'),
                        hat: getImageSrcToRender('hat'),
                        eyes: getImageSrcToRender('eyes'),
                        clothes: getImageSrcToRender('clothes'),
                        beak: getImageSrcToRender('beak'),
                        skin: getImageSrcToRender('skin'),
                        weapon: getImageSrcToRender('weapon'),

                    }} />
                    <div className={style.items}>
                        {createItemButton('beak', 'Beak')}
                        {createItemButton('skin', 'Skin')}
                        {createItemButton('weapon', 'Weapon')}
                        {createItemButton('background', 'Background')}
                    </div>
                </div>
                <div className={style.reset}>
                    <Button icon={<RefreshIcon />} onClick={resetItems}>Reset Items</Button>
                </div>
                <div className={style.controls}>
                    <Button type='cancel' onClick={cancelAll}>Cancel All</Button>
                    <Button type='primary' onClick={saveCustomization}>Confirm Customization</Button>
                </div>
            </section >
            {ownedPenguins &&
                <GoToAnotherPenguin className={style['another-penguins']}
                    selectedPenguinNonce={selectedPenguinNonce}
                    penguins={ownedPenguins}
                    subTitle={'Penguin #' + selectedPenguinNonce}
                />
            }
        </div >
    );

    function isSelectedNonceOwned() {
        return ownedPenguins && ownedPenguins.find(p => p.nonce == selectedPenguinNonce);
    }

    function getItem(identifier: string) {
        return ownedItems?.find(item => item.identifier === identifier);
    }

    function onItemClick(item: IItem) {

        toggleItemSelection(item);

        setItemsPopupIsOpen(false);

        // PROBLEM: on vient toggle la selection de l'item
        // mais le state ne s'update pas; donc validateItemChangement fait une vérification sur l'ancienne state

    }

    function toggleItemSelection(item: IItem) {
        const isSelected = selectedItemsInPopup[item.slot] === item.identifier;

        if (isSelected) {
            unselect(item);
        }
        else {
            select(item);
        }

    }

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

    function openItemsPopup(type: string, title: string) {
        setItemsPopupType(type);
        if (ownedItems) {
            setItemsInPopup(ownedItems);
        }
        setItemsPopupTitle(title);
        setItemsPopupIsOpen(true);
    }

    function getSelectedItemInSlot(slot: string) {
        const identifier = selectedItemsInPopup[slot];

        if (!identifier) return undefined;

        return getItem(identifier);
    }

    function getEquippedItemInSlot(slot: string) {
        const identifier = equippedItemsIdentifier[slot];

        return identifier ? getItem(identifier) : undefined;
    }

    function validateItemChangement(slot: string) {

        const selectedItem = getSelectedItemInSlot(slot);

        if (selectedItem != undefined) {
            equipItem(slot, selectedItem);
        } else {
            unequipItem(slot);
        }
    }

    function resetItems() {
        setEquippedItemsIdentifier({});
    }

    function cancelAll() {
        // go to inventory with confirmation
        if (confirm('Are you sure you want to cancel all changes?')) {
            window.location.href = '/inventory';
        }
    }

    function saveCustomization() {

        const itemsToEquip: ItemToken[] = [];
        const slotsToUnequip: string[] = [];

        for (const slot in equippedItemsIdentifier) {
            const itemIdentifier = equippedItemsIdentifier[slot];
            const blockchainCurrentlyEquippedItem = selectedPenguinData?.equippedItems[slot].identifier;

            if (itemIdentifier != blockchainCurrentlyEquippedItem) {
                if (itemIdentifier == undefined) {
                    slotsToUnequip.push(slot);
                }
                else {
                    const itemData = getItem(itemIdentifier);

                    if (!itemData) throw new Error(`Item ${itemIdentifier} not found in owned items.`);

                    itemsToEquip.push({
                        collection: itemData?.identifier,
                        nonce: itemData?.nonce
                    });
                }
            }
        }
        console.log(`Found ${itemsToEquip.length} items to equip and ${slotsToUnequip.length} slots to unequip.`);

        if (itemsToEquip.length > 0 || slotsToUnequip.length > 0) {

            const payload = new CustomizePayloadBuilder()
                .setCustomizationContractAddress(customisationContractAddress)
                .setPenguinCollection(penguinCollection)
                .setPenguinNonce(selectedPenguinNonce)
                .setItemsToEquip(itemsToEquip)
                .setSlotsToUnequip(slotsToUnequip)
                .build();

            // TODO: send tx


            // TODO: save customization
            console.log('save customization');
            // TODO: api call etc
        }
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

    function createItemButton(type: keyof PenguinItemsIdentifier, title: string) {

        const itemIdentifier = equippedItemsIdentifier[type];
        const item = itemIdentifier ? getItem(itemIdentifier) : undefined;

        const className = [
            style.item,
            item != undefined ? style.filled : style[type]
        ].join(' ');

        return <div
            className={className}
            onClick={() => { openItemsPopup(type, title); }}>
            {
                item && <img src={ipfsGateway + item.thumbnailCID} />
            }
        </div >
    }

};

export default Customize;