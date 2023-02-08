import * as React from 'react';
import { IItem, IOwnedItem } from '@apcolony/marketplace-api';
import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import { refreshAccount } from '@elrondnetwork/dapp-core/utils';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'
import Button from 'components/Abstract/Button/Button';
import CustomizeControls from 'components/Customize/Controls';
import ErrorPage from 'components/ErrorPage';
import LoadingOverlay from 'components/Foreground/LoadingOverlay';
import RefreshIcon from 'components/Icons/RefreshIcon';
import TrashIcon from 'components/Icons/TrashIcon';
import PopupFromBottom from 'components/Inventory/PopupFromBottom/PopupFromBottom';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import PenguinCustomizeHeader from 'components/Navigation/GoToAnotherPenguin';
import PenguinRender from 'components/PenguinRender/PenguinRender';
import { itemsDatabase } from 'config';
import useAddBodyClassNames from 'sdk/hooks/useAddBodyClassNames';
import useCustomization from 'sdk/hooks/useCustomization';
import useCustomizationPersistence from 'sdk/hooks/useCustomizationPersistence';
import useItemsSelection from 'sdk/hooks/useItemsSelection';
import { isIdValid } from 'sdk/misc/guards';
import { PenguinItemsIdentifier } from 'sdk/types/PenguinItemsIdentifier';
import style from './index.module.scss';

const Customize = () => {

    const { id } = useParams();

    if (!id) throw new Error('No id provided');

    const [, setTransactionSessionId] = React.useState<string | null>(null);

    const {
        load,
        save
    } = useCustomizationPersistence(id, itemsDatabase);

    const initialAttributes = load();

    const {
        resetItems,
        unequipAllItems,
        equipItem,
        unequipItem,
        getCustomizeTransaction,
        getRenderTransaction,
        isSlotModified,
        totalIceEquipped,
        equippedItemsIdentifier,
        attributesStatus,
        hasSomeModifications,
        selectedPenguin,
        ownedAndEquippedItems,
        isCustomizationPending,
        doUserOwnSelectedPenguin
    } = useCustomization(id, initialAttributes);

    const {
        toggle,
        setSelectedItems: setSelectedItemsInPopup,
        selectedItems: selectedItemsInPopup
    } = useItemsSelection({
        initialSelectedItems: initialAttributes,
        onSelectionChange: () => {

            for (const slot in selectedItemsInPopup) {
                equipIfSelectedOrUnequip(slot);
            }
        }
    });

    const editingEnabled = attributesStatus?.renderStatus != 'rendering' && !isCustomizationPending;

    /* Choose items popup */
    const [itemsPopupIsOpen, setItemsPopupIsOpen] = React.useState<boolean>(false);
    const [itemsPopupTitle, setItemsPopupTitle] = React.useState<string>('All My Items');
    const [filterSlot, setFilterSlot] = React.useState<string | undefined>(undefined);

    // Selected equipped items
    React.useEffect(() => {
        setSelectedItemsInPopup(equippedItemsIdentifier);
    }, [equippedItemsIdentifier])

    useAddBodyClassNames(['background-image', 'no-footer']);

    return (
        <div id={style['body-content']}>
            <MobileHeader title="Customize" subTitle={selectedPenguin?.displayName ?? ''} className={style['mobile-header']} />
            <PopupFromBottom
                title={itemsPopupTitle}
                filterSlot={filterSlot}
                isOpen={itemsPopupIsOpen}
                items={ownedAndEquippedItems ?? []}
                disableSelection={!editingEnabled}
                selectedItemsIdentifier={selectedItemsInPopup}
                onItemClick={onItemClick}
                select={() => { setItemsPopupIsOpen(false); }}
                changeType={(type) => {
                    openItemsPopup(type, 'Select ' + type);
                }}
            />

            {
                (selectedPenguin) &&
                <div className={style.head}>
                    <PenguinCustomizeHeader
                        currentPenguin={selectedPenguin}
                        subTitle={selectedPenguin?.displayName ?? ''}
                    />
                    <div className={style.iceBadgeContainer} id="iceBadgeContainer" data-tooltip-content="$ICE given by staking with the current customisation">
                        <div className={style.iceBadge}>
                            {totalIceEquipped} $ICE <FontAwesomeIcon icon={faInfoCircle} className={'pl-2'} />
                        </div>
                    </div>
                    <Tooltip anchorId="iceBadgeContainer" />
                </div>

            }

            <section className={style.customize}>
                <div className={style.content}>
                    <div className={style.items}>
                        {createItemButton('hat', 'Hats')}
                        {createItemButton('eyes', 'Eyes')}
                        {createItemButton('clothes', 'Clothes')}
                    </div>
                    {/* TODO: REFACTOR: too much repetitive */}
                    <PenguinRender
                        badge={parseInt(id)}
                        items={{
                            background: getImageSrcToRender('background'),
                            hat: getImageSrcToRender('hat'),
                            eyes: getImageSrcToRender('eyes'),
                            clothes: getImageSrcToRender('clothes'),
                            beak: getImageSrcToRender('beak'),
                            skin: getImageSrcToRender('skin'),
                            weapon: getImageSrcToRender('weapon'),

                        }}>
                        {attributesStatus?.renderStatus == 'rendering' &&
                            <LoadingOverlay>
                                <h2 className='mt-2'>Rendering</h2>
                                <br />
                                <p>We are building your new penguin thumbnail on the blockchain</p>
                                <p>Please, wait a minute</p>
                            </LoadingOverlay>
                        }

                        {
                            isCustomizationPending &&
                            <LoadingOverlay>
                                <h2 className='mt-2'>Customisation in progress</h2>
                                <br />
                                <p>Please, wait a minute</p>
                            </LoadingOverlay>
                        }
                    </PenguinRender>
                    <div className={style.items}>
                        {createItemButton('beak', 'Beak')}
                        {createItemButton('skin', 'Skin')}
                        {createItemButton('weapon', 'Weapon')}
                        {createItemButton('background', 'Background')}
                    </div>
                </div>
                {
                    (editingEnabled) &&
                    <>
                        <div className={style.utilsBtn}>
                            <Button icon={<RefreshIcon />} onClick={resetItems}>
                                Reset
                            </Button>

                            <Button icon={<TrashIcon />} onClick={unequipAllItems}>
                                Unequip All
                            </Button>
                        </div>

                        <CustomizeControls
                            doUserOwnSelectedPenguin={doUserOwnSelectedPenguin}
                            hasSomeModifications={hasSomeModifications}
                            onCustomizeClick={sendCustomizationTx}
                            onRenderClick={sendRenderImageTx}
                            renderStatus={attributesStatus?.renderStatus}
                        />
                    </>
                }
            </section >




        </div >
    );

    function onItemClick(item: IItem) {
        if (!editingEnabled) return;
        toggle(item);

        if (window.innerWidth > 800) {
            setItemsPopupIsOpen(false);
        }
    }

    function openItemsPopup(type: string | undefined, title: string) {

        if (!editingEnabled) return;

        setFilterSlot(type);
        setItemsPopupTitle(title);
        setItemsPopupIsOpen(true);
    }

    function equipIfSelectedOrUnequip(slot: string) {

        if (!editingEnabled) return;

        const selectedItem = getSelectedItemInSlot(slot);

        if (selectedItem != undefined) {
            equipItem(slot, selectedItem);
        } else {
            unequipItem(slot);
        }
    }

    async function sendRenderImageTx() {

        save(equippedItemsIdentifier);
        const transaction = getRenderTransaction();

        await refreshAccount();

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

    function getItem(identifier: string | undefined): IOwnedItem | undefined {
        if (!identifier) return undefined;
        if (!ownedAndEquippedItems) return undefined;

        const item = ownedAndEquippedItems.find(i => i.identifier === identifier);

        if (!item) {
            console.warn(`Item ${identifier} not found in owned items.`);
        }

        return item;
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
                item && <img src={item.thumbnailUrls.small} />
            }
        </div >
    }

    function getImageSrcToRender(slot: keyof PenguinItemsIdentifier) {
        const item = getEquippedItemInSlot(slot);

        if (item != undefined) {

            if (!item.renderUrls.high) throw new Error(`Item ${item.displayName} in slot ${slot} has no renderCID.`);

            return item.renderUrls.high;
        }
        else {
            return undefined;
        }
    }

};

const CustomizeErrorWrapper = () => {

    const { id } = useParams();
    if (!id) throw new Error('No id provided');

    if (isIdValid(id, 'penguins') == false) {
        return <ErrorPage
            title='Unknown id'
            description="Please, select another penguin."
        />
    }
    else {
        return <Customize />
    }
}

export default CustomizeErrorWrapper;