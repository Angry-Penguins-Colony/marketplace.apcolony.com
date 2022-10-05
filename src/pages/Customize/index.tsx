import * as React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import { refreshAccount } from '@elrondnetwork/dapp-core/utils';
import { useParams } from 'react-router-dom';
import Button from 'components/Abstract/Button/Button';
import ModalAboutRender from 'components/Foreground/Modals/ModalAboutRender/ModalAboutRender';
import OverlayRenderInProgress from 'components/Foreground/Overlays/OverlayRenderInProgress';
import RefreshIcon from 'components/Icons/RefreshIcon';
import PopupFromBottom from 'components/Inventory/PopupFromBottom/PopupFromBottom';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import GoToAnotherPenguin from 'components/Navigation/GoToAnotherPenguin/GoToAnotherPenguin';
import PenguinRender from 'components/PenguinRender/PenguinRender';
import { ipfsGateway } from 'config';
import { buildRouteLinks } from 'routes';
import { useGetOwnedItems, useGetOwnedPenguins } from 'sdk/hooks/api/useGetOwned';
import useCustomization from 'sdk/hooks/useCustomization';
import useCustomizationPersistence from 'sdk/hooks/useCustomizationPersistence';
import useItemsSelection from 'sdk/hooks/useItemsSelection';
import { PenguinItemsIdentifier } from 'sdk/types/PenguinItemsIdentifier';
import style from './index.module.scss';

const Customize = () => {

    const { id } = useParams();
    const selectedPenguinNonce = parseInt(id ?? '');

    const ownedItems = useGetOwnedItems();
    const ownedPenguins = useGetOwnedPenguins();
    const [, setTransactionSessionId] = React.useState<string | null>(null);

    const [showModalAboutRender, setShowModalAboutRender] = React.useState<boolean>(false);

    const {
        load,
        save
    } = useCustomizationPersistence(selectedPenguinNonce);

    const initialAttributes = load();
    const {
        resetItems,
        equipItem,
        unequipItem,
        getCustomizeTransaction,
        getRenderTransaction,
        isSlotModified,
        equippedItemsIdentifier,
        attributesStatus,
        hasSomeModifications,
        selectedPenguin,
        ownedItemsAmount,
        ownedAndEquippedItems
    } = useCustomization(selectedPenguinNonce, initialAttributes);



    const {
        toggle,
        setSelectedItems: setSelectedItemsInPopup,
        selectedItems: selectedItemsInPopup
    } = useItemsSelection({
        initialSelectedItems: initialAttributes,
        onSelectionChange: () => {

            for (const slot in selectedItemsInPopup) {
                console.log(slot);
                equipIfSelectedOrUnequip(slot);
            }
        }
    });

    const editingEnabled = attributesStatus?.renderStatus != 'rendering';

    /* Choose items popup */
    const [itemsPopupIsOpen, setItemsPopupIsOpen] = React.useState<boolean>(false);
    const [itemsPopupTitle, setItemsPopupTitle] = React.useState<string>('All My Items');
    const [itemsPopupType, setItemsPopupType] = React.useState<string>('all');
    const [itemsInPopup, setItemsInPopup] = React.useState<IItem[]>([]);

    // Selected equipped items
    React.useEffect(() => {
        setSelectedItemsInPopup(equippedItemsIdentifier);
    }, [equippedItemsIdentifier])

    React.useEffect(() => {
        setItemsInPopup(ownedAndEquippedItems);

    }, [ownedAndEquippedItems]);


    if (!isSelectedNonceOwned() && ownedPenguins && ownedPenguins.length > 0) {
        window.location.href = buildRouteLinks.customize(ownedPenguins[0].nonce);
    }

    // add root class for background style
    React.useEffect(() => {
        document.body.classList.add('background-image');
    }, []);

    return (
        <div id={style['body-content']}>
            <ModalAboutRender isVisible={showModalAboutRender} onSignRenderClick={onSignRenderClick} />
            <MobileHeader title="Customize" subTitle={selectedPenguin?.name ?? ''} className={style['mobile-header']} />
            <PopupFromBottom
                title={itemsPopupTitle}
                type={itemsPopupType}
                isOpen={itemsPopupIsOpen}
                items={itemsInPopup}
                disableSelection={!editingEnabled}
                selectedItemsIdentifier={selectedItemsInPopup}
                ownedItemsAmount={ownedItemsAmount ?? {}}
                onItemClick={onItemClick}
                select={() => { setItemsPopupIsOpen(false); }}
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
                        {attributesStatus?.renderStatus == 'rendering' &&
                            <OverlayRenderInProgress />
                        }
                    </PenguinRender>
                    <div className={style.items}>
                        {createItemButton('beak', 'Beak')}
                        {createItemButton('skin', 'Skin')}
                        {createItemButton('weapon', 'Weapon')}
                        {createItemButton('background', 'Background')}
                    </div>
                </div>
                {(attributesStatus?.renderStatus != 'rendering') &&
                    <>
                        <div className={style.reset}>
                            <Button icon={<RefreshIcon />} onClick={resetItems}>Unequip Items</Button>
                        </div>
                        <div className={style.controls}>
                            {/* <Button type='cancel' onClick={cancelAll}>Cancel All</Button> */}
                            <Button type='primary' onClick={onConfirmCustomClick} disabled={!hasSomeModifications || !attributesStatus}>

                                {getCustomizeButtonContent()}
                            </Button>


                        </div>


                    </>
                }
            </section >
            {ownedPenguins &&
                <GoToAnotherPenguin className={style['another-penguins']}
                    selectedPenguinNonce={selectedPenguinNonce}
                    penguins={ownedPenguins}
                    subTitle={selectedPenguin?.name ?? ''}
                />
            }
        </div >
    );

    function getCustomizeButtonContent() {

        console.log(attributesStatus);

        if (attributesStatus) {
            switch (attributesStatus.renderStatus) {
                case 'none':
                    return 'Render Image on blockchain';

                case 'rendering':
                case 'rendered':

                    if (!hasSomeModifications) {
                        return 'No changes detected'
                    }
                    else {
                        return 'Customize';
                    }
            }
        }
        else {
            return <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>;
        }
    }

    function onItemClick(item: IItem) {
        if (!editingEnabled) return;
        toggle(item);

        if (window.innerWidth > 800) {
            setItemsPopupIsOpen(false);
        }
    }

    function onSignRenderClick() {
        setShowModalAboutRender(false);
        sendRenderImageTx();
    }

    async function onConfirmCustomClick() {


        console.log('onConfirmCustomClick');

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
            setItemsInPopup(ownedAndEquippedItems);
        }
        setItemsPopupTitle(title);
        setItemsPopupIsOpen(true);
    }

    function equipIfSelectedOrUnequip(slot: string) {

        if (!editingEnabled) return;

        const selectedItem = getSelectedItemInSlot(slot);

        console.log('selected item for slot', slot, 'is', selectedItem?.name ?? undefined);

        if (selectedItem != undefined) {
            equipItem(slot, selectedItem);
        } else {
            unequipItem(slot);
        }
    }

    async function sendRenderImageTx() {

        const transaction = getRenderTransaction();


        await refreshAccount();

        save(equippedItemsIdentifier);

        const { sessionId } = await sendTransactions({
            transactions: transaction,
            transactionDisplayInfo: {
                processingMessage: 'Processing render transaction',
                errorMessage: 'An error has occured during render',
                successMessage: 'Render transaction successful',
            },
            redirectAfterSign: false,
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

        const item = ownedAndEquippedItems.find(i => i.identifier === identifier);

        if (!item) throw new Error(`Item ${identifier} not found in owned items.`);

        return item;
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

    function createItemButton(slot: keyof PenguinItemsIdentifier, title: string) {

        const itemIdentifier = equippedItemsIdentifier[slot];
        const item = itemIdentifier ? getItem(itemIdentifier) : undefined;

        const className = [
            style.item,
            item != undefined ? style.filled : style[slot],
            isSlotModified(slot) ? style.modified : ''
        ].join(' ');

        return <div
            className={className}
            onClick={() => { openItemsPopup(slot, title); }}>
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