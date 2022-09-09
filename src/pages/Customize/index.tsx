import * as React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { useParams } from 'react-router-dom';
import Button from 'components/Button/Button';
import RefreshIcon from 'components/Icons/RefreshIcon';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import { ipfsGateway } from 'config';
import { useGetOwnedItems, useGetOwnedPenguins } from 'sdk/hooks/useGetOwned';
import style from './customize.module.scss';
import GoToAnotherPenguin from './GoToAnotherPenguin';
import PopupFromBottom from './PopupFromBottom';
import PenguinRender from './Render';

type PenguinItems = Record<string, IItem | undefined>;

const Customize = () => {
    const { id } = useParams();
    const selectedPenguinNonce = parseInt(id ?? '');
    const ownedPenguins = useGetOwnedPenguins();
    const selectedPenguinData = ownedPenguins?.find((penguin) => penguin.nonce === selectedPenguinNonce);

    const [penguinItems, setPenguinItems] = React.useState<PenguinItems>({});

    React.useEffect(() => {

        if (!selectedPenguinData) return;

        setPenguinItems(selectedPenguinData.equippedItems);
        setSelectedItemsInPopup(selectedPenguinData.equippedItems);
    }, [selectedPenguinData]);


    /* Choose items popup */
    const [itemsPopupIsOpen, setItemsPopupIsOpen] = React.useState<boolean>(false);
    const [itemsPopupTitle, setItemsPopupTitle] = React.useState<string>('All My Items');
    const [itemsPopupType, setItemsPopupType] = React.useState<string>('all');
    const [itemsInPopup, setItemsInPopup] = React.useState<IItem[]>([]);
    const [selectedItemsInPopup, setSelectedItemsInPopup] = React.useState<PenguinItems>({});

    const ownedItems = useGetOwnedItems();

    if (!isSelectedNonceOwned() && ownedPenguins && ownedPenguins.length > 0) {
        window.location.href = `/customize/${ownedPenguins[0].nonce}`;
    }

    React.useEffect(() => {
        if (ownedItems) {
            setItemsInPopup(ownedItems);
        }
    }, [ownedItems]);

    function getImageSrcToRender(slot: keyof PenguinItems) {
        const item = penguinItems[slot];

        if (item != undefined) {

            if (!item.renderCID) throw new Error(`Item for slot ${slot} has no renderCID. ${item}`);

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
                selectedItems={selectedItemsInPopup}
                toggleSelected={toggleSelection}
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

    function toggleSelection(item: IItem) {
        console.log(`Toggling item ${item.name} (${item.slot})`);

        const isSelected = selectedItemsInPopup[item.slot] === item;

        if (isSelected) {
            unselect(item);
        }
        else {
            select(item);
        }

        // change inlive if it's desktop version
        if (window.innerWidth > 800) {
            validateItemChangement(item.slot);
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
            [item.slot]: item
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

    function getSelectItem(slot: string) {
        return selectedItemsInPopup[slot];
    }

    function validateItemChangement(slot: string) {

        const selectedItem = getSelectItem(slot);

        if (selectedItem != undefined) {
            equipItem(slot, selectedItem);
        } else {
            unequipItem(slot);
        }

        setItemsPopupIsOpen(false);
    }

    function resetItems() {
        setPenguinItems({});
    }

    function cancelAll() {
        // go to inventory with confirmation
        if (confirm('Are you sure you want to cancel all changes?')) {
            window.location.href = '/inventory';
        }
    }

    function saveCustomization() {
        // TODO: save customization
        console.log('save customization');
        // TODO: api call etc
    }

    function equipItem(slot: string, item: IItem) {
        const newItems = {
            ...penguinItems,
            [slot]: item
        };

        setPenguinItems(newItems);

        console.log(`Equipping item ${item.name} (${item.slot})`);
    }

    function unequipItem(slot: string) {
        const newItems = { ...penguinItems };
        newItems[slot] = undefined;
        setPenguinItems(newItems);

        console.log(`Unequipping item from slot ${slot}`);
    }

    function createItemButton(type: keyof PenguinItems, title: string) {

        const item = penguinItems[type];

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