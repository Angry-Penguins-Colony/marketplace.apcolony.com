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
import { Item } from './Item';
import PopupFromBottom from './PopupFromBottom';
import PenguinRender from './Render';



interface PenguinItems {
    background?: IItem;
    hat?: IItem;
    eyes?: IItem;
    clothes?: IItem;
    beak?: IItem;
    skin?: IItem;
    weapon?: IItem;
}

const Customize = () => {
    const { id } = useParams();
    const selectedPenguinNonce = parseInt(id ?? '');
    const ownedPenguins = useGetOwnedPenguins();
    const selectedPenguinData = ownedPenguins?.find((penguin) => penguin.nonce === selectedPenguinNonce);

    const [penguinItems, setPenguinItems] = React.useState<PenguinItems>({});

    React.useEffect(() => {

        if (!selectedPenguinData) return;

        const newPenguinsItems: PenguinItems = {};

        // TODO: too much repetitive code, refactor
        newPenguinsItems.background = selectedPenguinData.equippedItems['background'];
        newPenguinsItems.hat = selectedPenguinData.equippedItems['hat'];
        newPenguinsItems.eyes = selectedPenguinData.equippedItems['eyes'];
        newPenguinsItems.clothes = selectedPenguinData.equippedItems['clothes'];
        newPenguinsItems.beak = selectedPenguinData.equippedItems['beak'];
        newPenguinsItems.skin = selectedPenguinData.equippedItems['skin'];
        newPenguinsItems.weapon = selectedPenguinData.equippedItems['weapon'];

        setPenguinItems(newPenguinsItems);

        console.log('equippedItems', selectedPenguinData.equippedItems);
        console.log('newPenguinsItems', newPenguinsItems);

        setPenguinItems(newPenguinsItems);
    }, [selectedPenguinData]);


    /* Choose items popup */

    const [itemsPopupIsOpen, setItemsPopupIsOpen] = React.useState<boolean>(false);
    const [itemsPopupTitle, setItemsPopupTitle] = React.useState<string>('All My Items');
    const [itemsPopupType, setItemsPopupType] = React.useState<string>('all');
    const [itemsInPopup, setItemsInPopup] = React.useState<Item[]>([]);

    const ownedItems = useGetOwnedItems();


    if (!isSelectedNonceOwned() && ownedPenguins && ownedPenguins.length > 0) {
        window.location.href = `/customize/${ownedPenguins[0].nonce}`;
    }

    React.useEffect(() => {
        if (ownedItems) {
            setItemsInPopup(ownedItems);
        }
    }, [ownedItems]);

    return (
        <div id={style['body-content']}>
            <MobileHeader title="Customize" subTitle={'Penguin #' + selectedPenguinNonce} className={style['mobile-header']} />
            <PopupFromBottom
                title={itemsPopupTitle}
                type={itemsPopupType}
                isOpen={itemsPopupIsOpen}
                items={itemsInPopup}
                toggleSelected={toggleSelectedInPopup}
                cancel={() => { setItemsPopupIsOpen(false); }}
                select={(type) => {
                    validateItemChangement(type);
                }}
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
                        background: penguinItems.background ? ipfsGateway + penguinItems.background.renderCID : undefined,
                        hat: penguinItems.hat ? ipfsGateway + penguinItems.hat.renderCID : undefined,
                        eyes: penguinItems.eyes ? ipfsGateway + penguinItems.eyes.renderCID : undefined,
                        clothes: penguinItems.clothes ? ipfsGateway + penguinItems.clothes.renderCID : undefined,
                        beak: penguinItems.beak ? ipfsGateway + penguinItems.beak.renderCID : undefined,
                        skin: penguinItems.skin ? ipfsGateway + penguinItems.skin.renderCID : undefined,
                        weapon: penguinItems.weapon ? ipfsGateway + penguinItems.weapon.renderCID : undefined,

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

    // change selected item in popup
    function toggleSelectedInPopup(itemIndex: number, type: string) {
        // search item with id and change isSelected
        const newItems = [...itemsInPopup];
        const newIsSelected = !newItems[itemIndex].isSelected;
        if (newIsSelected) {
            // unselect all other items
            newItems.forEach((item) => {
                item.isSelected = false;
            });
        }

        newItems[itemIndex].isSelected = !newItems[itemIndex].isSelected;

        setItemsInPopup(newItems);

        // change inlive if it's desktop version
        if (window.innerWidth > 800) {
            validateItemChangement(type);
        }
    }

    function openItemsPopup(type: string, title: string) {
        setItemsPopupType(type);
        // setItemsInPopup(ownedItems);
        setItemsPopupTitle(title);
        setItemsPopupIsOpen(true);
    }

    function validateItemChangement(type: string) {
        const selectedItem = itemsInPopup.find((item) => item.isSelected);
        if (selectedItem) {
            addItem(type, ipfsGateway + selectedItem.renderCID);
        } else {
            addItem(type, undefined);
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

    function addItem(itemType: string, itemSrc: string | undefined) {
        // add item
        const newItems = {
            ...penguinItems,
            [itemType]: itemSrc
        };
        setPenguinItems(newItems);
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