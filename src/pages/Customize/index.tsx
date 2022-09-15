import * as React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import { refreshAccount } from '@elrondnetwork/dapp-core/utils';
import { useParams } from 'react-router-dom';
import Button from 'components/Button/Button';
import RefreshIcon from 'components/Icons/RefreshIcon';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import { ipfsGateway } from 'config';
import useCustomization from 'sdk/hooks/useCustomization';
import { useGetOwnedItems, useGetOwnedPenguins } from 'sdk/hooks/useGetOwned';
import useItemsSelection from 'sdk/hooks/useItemsSelection';
import { PenguinItemsIdentifier } from 'sdk/types/PenguinItemsIdentifier';
import style from './customize.module.scss';
import GoToAnotherPenguin from './GoToAnotherPenguin';
import ModalAboutRender from './Modals/ModalAboutRender';
import OverlayRenderInProgress from './Overlays/OverlayRenderInProgress';
import PopupFromBottom from './PopupFromBottom';
import PenguinRender from './Render';

const Customize = () => {

    const { id } = useParams();
    const selectedPenguinNonce = parseInt(id ?? '');

    const ownedItems = useGetOwnedItems();
    const ownedPenguins = useGetOwnedPenguins();
    const [, setTransactionSessionId] = React.useState<string | null>(null);

    const [showModalAboutRender, setShowModalAboutRender] = React.useState<boolean>(false);

    const {
        resetItems,
        equipItem,
        unequipItem,
        getCustomizeTransaction,
        getRenderTransaction,
        equippedItemsIdentifier,
        attributesStatus,
    } = useCustomization(selectedPenguinNonce);

    const {
        toggle,
        setSelectedItemsInPopup,
        selectedItemsInPopup
    } = useItemsSelection();

    const editingEnabled = attributesStatus?.renderStatus == 'none';

    React.useEffect(() => {
        setSelectedItemsInPopup(equippedItemsIdentifier);
    }, [equippedItemsIdentifier])

    /* Choose items popup */
    const [itemsPopupIsOpen, setItemsPopupIsOpen] = React.useState<boolean>(false);
    const [itemsPopupTitle, setItemsPopupTitle] = React.useState<string>('All My Items');
    const [itemsPopupType, setItemsPopupType] = React.useState<string>('all');
    const [itemsInPopup, setItemsInPopup] = React.useState<IItem[]>([]);

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

    if (!isSelectedNonceOwned() && ownedPenguins && ownedPenguins.length > 0) {
        window.location.href = `/customize/${ownedPenguins[0].nonce}`;
    }

    return (
        <div id={style['body-content']}>
            <ModalAboutRender isVisible={showModalAboutRender} onSignRenderClick={onSignRenderClick} />
            <MobileHeader title="Customize" subTitle={'Penguin #' + selectedPenguinNonce} className={style['mobile-header']} />
            <PopupFromBottom
                title={itemsPopupTitle}
                type={itemsPopupType}
                isOpen={itemsPopupIsOpen}
                items={itemsInPopup}
                disableSelection={!editingEnabled}
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

                    }}>
                        <OverlayRenderInProgress />
                    </PenguinRender>
                    <div className={style.items}>
                        {createItemButton('beak', 'Beak')}
                        {createItemButton('skin', 'Skin')}
                        {createItemButton('weapon', 'Weapon')}
                        {createItemButton('background', 'Background')}
                    </div>
                </div>
                {editingEnabled &&
                    <>
                        <div className={style.reset}>
                            <Button icon={<RefreshIcon />} onClick={resetItems}>Reset Items</Button>
                        </div>
                        <div className={style.controls}>
                            <Button type='cancel' onClick={cancelAll}>Cancel All</Button>
                            <Button type='primary' onClick={onConfirmCustomClick}>Confirm Customization</Button>
                        </div>
                    </>
                }
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

    function onItemClick(item: IItem) {
        if (!editingEnabled) return;
        toggle(item);

        setItemsPopupIsOpen(false);
    }

    function onSignRenderClick() {
        setShowModalAboutRender(false);
        sendRenderImageTx();
    }

    async function onConfirmCustomClick() {

        if (!attributesStatus) return;

        switch (attributesStatus?.renderStatus) {
            case 'none':
                setShowModalAboutRender(true);
                return;

            case 'rendered':
                sendCustomizationTx();
                return;

            case 'rendering':
                throw new Error('Not implemented');
        }
    }

    function openItemsPopup(type: string, title: string) {
        setItemsPopupType(type);
        if (ownedItems) {
            setItemsInPopup(ownedItems);
        }
        setItemsPopupTitle(title);
        setItemsPopupIsOpen(true);
    }

    function validateItemChangement(slot: string) {

        if (!editingEnabled) return;

        const selectedItem = getSelectedItemInSlot(slot);

        if (selectedItem != undefined) {
            equipItem(slot, selectedItem);
        } else {
            unequipItem(slot);
        }
    }

    function cancelAll() {
        // go to inventory with confirmation
        if (confirm('Are you sure you want to cancel all changes?')) {
            window.location.href = '/inventory';
        }
    }

    async function sendRenderImageTx() {

        const transaction = getRenderTransaction();

        await refreshAccount();

        const { sessionId } = await sendTransactions({
            transactions: transaction,
            transactionDisplayInfo: {
                processingMessage: 'Processing render transaction',
                errorMessage: 'An error has occured during render',
                successMessage: 'Render transaction successful'
            },
            redirectAfterSign: false
        });

        if (sessionId != null) {
            setTransactionSessionId(sessionId);
        }
    }

    async function sendCustomizationTx() {
        const transaction = getCustomizeTransaction();
        await refreshAccount();

        const { sessionId } = await sendTransactions({
            transactions: transaction,
            transactionDisplayInfo: {
                processingMessage: 'Processing customization transaction',
                errorMessage: 'An error has occured during customization',
                successMessage: 'Customization transaction successful'
            },
            redirectAfterSign: false
        });

        if (sessionId != null) {
            setTransactionSessionId(sessionId);
        }
    }

    function getItem(identifier: string | undefined) {
        if (!identifier) return undefined;

        return ownedItems?.find(item => item.identifier === identifier);
    }

    function isSelectedNonceOwned() {
        return ownedPenguins && ownedPenguins.find(p => p.nonce == selectedPenguinNonce);
    }

    function getSelectedItemInSlot(slot: string) {
        return getItem(selectedItemsInPopup[slot]);
    }

    function getEquippedItemInSlot(slot: string) {
        return getItem(equippedItemsIdentifier[slot]);
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
};

export default Customize;