import * as React from 'react';
import { IItem, IPenguin } from '@apcolony/marketplace-api';
import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import { refreshAccount } from '@elrondnetwork/dapp-core/utils';
import { useParams } from 'react-router-dom';
import Button from 'components/Abstract/Button/Button';
import ErrorPage from 'components/ErrorPage';
import LoadingOverlay from 'components/Foreground/LoadingOverlay';
import ModalAboutRender from 'components/Foreground/Modals/ModalAboutRender/ModalAboutRender';
import RefreshIcon from 'components/Icons/RefreshIcon';
import PopupFromBottom from 'components/Inventory/PopupFromBottom/PopupFromBottom';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import GoToAnotherPenguin from 'components/Navigation/GoToAnotherPenguin/GoToAnotherPenguin';
import PenguinRender from 'components/PenguinRender/PenguinRender';
import { buildRouteLinks } from 'routes';
import { useGetOwnedPenguins } from 'sdk/hooks/api/useGetOwned';
import useCustomization from 'sdk/hooks/useCustomization';
import useCustomizationPersistence from 'sdk/hooks/useCustomizationPersistence';
import useItemsSelection from 'sdk/hooks/useItemsSelection';
import { isIdValid } from 'sdk/misc/guards';
import { PenguinItemsIdentifier } from 'sdk/types/PenguinItemsIdentifier';
import style from './index.module.scss';

/**
 * We only set ownedPenguins in props, because we already get it in the ErrorWrapper.
 * It is an optimization to reduce API calls.
 */
interface ICustomizeProps {
    ownedPenguins: IPenguin[]
}

const Customize = ({ ownedPenguins }: ICustomizeProps) => {

    const { id } = useParams();

    if (!id) throw new Error('No id provided');

    const [, setTransactionSessionId] = React.useState<string | null>(null);

    const [showModalAboutRender, setShowModalAboutRender] = React.useState<boolean>(false);

    const {
        load,
        save
    } = useCustomizationPersistence(id);

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
                console.log(slot);
                equipIfSelectedOrUnequip(slot);
            }
        }
    });

    const editingEnabled = attributesStatus?.renderStatus != 'rendering';

    /* Choose items popup */
    const [itemsPopupIsOpen, setItemsPopupIsOpen] = React.useState<boolean>(false);
    const [itemsPopupTitle, setItemsPopupTitle] = React.useState<string>('All My Items');
    const [filterSlot, setFilterSlot] = React.useState<string | undefined>(undefined);

    // Selected equipped items
    React.useEffect(() => {
        setSelectedItemsInPopup(equippedItemsIdentifier);
    }, [equippedItemsIdentifier])

    // add root class for background style
    React.useEffect(() => {
        document.body.classList.add('background-image');
    }, []);

    if (doUserOwnSelectedPenguin == false) {
        window.location.href = buildRouteLinks.customize(ownedPenguins[0].id);
    }

    return (
        <div id={style['body-content']}>
            <ModalAboutRender isVisible={showModalAboutRender} onSignRenderClick={onSignRenderClick} />
            <MobileHeader title="Customize" subTitle={selectedPenguin?.name ?? ''} className={style['mobile-header']} />
            <PopupFromBottom
                title={itemsPopupTitle}
                filterSlot={filterSlot}
                isOpen={itemsPopupIsOpen}
                items={ownedAndEquippedItems ?? []}
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
                            <LoadingOverlay>
                                <h2>Rendering in progress</h2>
                                <br />
                                <p>We are building your new penguin thumbnail on the blockchain</p>
                                <p>Please, wait a minute</p>
                            </LoadingOverlay>
                        }

                        {
                            isCustomizationPending &&
                            <LoadingOverlay>
                                <h2>Customisation in progress</h2>
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
                {(!isCustomizationPending && attributesStatus?.renderStatus != 'rendering') &&
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
            {(ownedPenguins && selectedPenguin) &&
                <GoToAnotherPenguin className={style['another-penguins']}
                    currentId={selectedPenguin.id}
                    penguins={ownedPenguins}
                    subTitle={selectedPenguin?.name ?? ''}
                />
            }
        </div >
    );

    function getCustomizeButtonContent() {

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

    function openItemsPopup(type: string | undefined, title: string) {
        setFilterSlot(type);
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
        if (!ownedAndEquippedItems) return undefined;

        const item = ownedAndEquippedItems.find(i => i.identifier === identifier);

        if (!item) throw new Error(`Item ${identifier} not found in owned items.`);

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
                item && <img src={item.thumbnailWebUri} />
            }
        </div >
    }

    function getImageSrcToRender(slot: keyof PenguinItemsIdentifier) {
        const item = getEquippedItemInSlot(slot);

        if (item != undefined) {

            if (!item.renderUrl) throw new Error(`Item ${item.name} in slot ${slot} has no renderCID.`);

            return item.renderUrl;
        }
        else {
            return undefined;
        }
    }

};

const CustomizeErrorWrapper = () => {

    const { id } = useParams();
    const ownedPenguins = useGetOwnedPenguins();

    if (!id) throw new Error('No id provided');

    if (isIdValid(id, 'penguins') == false) {
        return <ErrorPage
            title='Unknown id'
            description="Please, select another penguin."
        />
    }
    else if (!ownedPenguins) {
        return <></>;
    }
    else if (ownedPenguins.length == 0) {
        return <ErrorPage
            title='No penguin'
            description="Sorry, you don't own any penguin :("
        />;
    }
    else {
        return <Customize ownedPenguins={ownedPenguins} />
    }
}

export default CustomizeErrorWrapper;