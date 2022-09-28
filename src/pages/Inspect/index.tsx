import * as React from 'react';
import { IOffer } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import { SimpleTransactionType } from '@elrondnetwork/dapp-core/types';
import { refreshAccount } from '@elrondnetwork/dapp-core/utils';
import { Address } from '@elrondnetwork/erdjs/out';
import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';
import Button from 'components/Abstract/Button/Button';
import AddressWrapper from 'components/AddressWrapper';
import BuyingPopup from 'components/Foreground/Popup/BuyingPopup/BuyingPopup';
import ShowOffersPopup from 'components/Foreground/Popup/ShowOffersPopup';
import ShareIcon from 'components/Icons/ShareIcon';
import ItemsAndActivities from 'components/Inventory/ItemsAndActivities/ItemsAndActivities';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import SpinningLoad from 'components/SpinningLoad';
import { marketplaceContractAddress } from 'config';
import { buildRouteLinks } from 'routes';
import useInspect from 'sdk/hooks/useInspect';
import CategoriesType from 'sdk/types/CategoriesType';
import style from './index.module.scss';

const Inspect = () => {
    const params = useParams();
    const category = params.type as CategoriesType;
    const id = params.id;

    if (!category) throw new Error('type is required');
    if (!id) throw new Error('Item id is required');

    const {
        item,
        isListedByConnected,
        ownedByConnectedWallet,
        priceListedByUser,
        activities,
        itemAsPenguin,
        ownedOffers,
        getSellTransaction,
        getRetireTransaction
    } = useInspect(category, id);
    const { address: connectedAddress } = useGetAccountInfo();

    const [isSellPopupOpen, setIsSellPopupOpen] = React.useState(false);
    const [isOffersPopupOpen, setIsOffersPopupOpen] = React.useState(false);

    const isConnected = connectedAddress != '';
    const typeInText = getTypeInText();

    return (
        <div id={style['item-in-inventory']}>
            <MobileHeader title={typeInText.plural} type='light' />
            <div className={style.thumbnail}>
                <img src={item?.thumbnail ?? ''} alt={item?.name ?? 'loading item'} />
            </div>
            <div className={style.infos}>
                <p className={style.name}>{item?.name ?? '---'}</p>
                <div className={style.share} onClick={() => {
                    if (!item) return;
                    window.navigator.share({
                        title: item.name,
                        text: 'Check out this item Angry Penguin Marketplace',
                        url: window.location.href,
                    })
                }}>
                    <ShareIcon />
                </div>
                <div className={style.rank}>
                    {getOwnedProperty()}
                </div>
            </div>
            <div className={style.actions + (isListedByConnected ? ' ' + style['in-market'] : '')}>
                {ownedByConnectedWallet == true &&
                    <>
                        {
                            (item && item.amount != undefined && item.amount > 0) &&
                            <Button type='normal' onClick={() => { setIsSellPopupOpen(true) }}>
                                Sell {typeInText.singular}
                            </Button>
                        }

                        {
                            (category === 'penguins' && !isListedByConnected) &&
                            <Button type='primary' onClick={() => {
                                window.location.href = buildRouteLinks.customize(id);
                            }}>
                                Customize
                            </Button>
                        }

                        {
                            (() => {

                                if (!ownedOffers) return;
                                if (ownedOffers.length == 0) return;

                                if (ownedOffers.length == 1) {
                                    return <>
                                        <Button type='cancel-outline' onClick={() => sendRetireOffer(ownedOffers[0])}>
                                            Retire offer
                                        </Button>
                                        <p className={style.price}>
                                            Listed for {priceListedByUser ?? '--'} EGLD
                                        </p>
                                    </>
                                }
                                else {
                                    return <>
                                        <Button type='cancel-outline' onClick={() => setIsOffersPopupOpen(true)}>
                                            View offers
                                        </Button>
                                        <p className={style.price}>
                                            {ownedOffers.length} listed                                        </p>
                                    </>
                                }

                            })()
                        }
                    </>
                }
            </div>
            <hr />
            <ItemsAndActivities items={item?.items ?? []} activities={activities} className={style.activity} />

            {
                item &&
                <BuyingPopup
                    onClose={() => { setIsSellPopupOpen(false) }}
                    onSell={sell}
                    item={item}
                    type={category}
                    visible={isSellPopupOpen}
                />
            }
            {
                ownedOffers &&
                <ShowOffersPopup
                    offers={ownedOffers}
                    isVisible={isOffersPopupOpen}
                    onCloseClicked={() => { setIsOffersPopupOpen(false) }}
                />
            }
        </div >
    );

    async function sendRetireOffer(offer: IOffer) {
        const transaction: SimpleTransactionType = getRetireTransaction(offer);
        await refreshAccount();

        await sendTransactions({
            transactions: transaction,
            transactionDisplayInfo: {
                processingMessage: 'Retiring offer...',
                errorMessage: 'An error has occured during retirement of offer.',
                successMessage: 'Offer retired'
            },
            redirectAfterSign: false
        });
    }

    function getOwnedProperty() {

        if (!item) return;

        switch (category) {
            case 'penguins':

                return <div className={style['owned-property']}>
                    <p className={style['owned-property-text']}>
                        {
                            (() => {
                                if (itemAsPenguin && itemAsPenguin.owner == marketplaceContractAddress.bech32()) {
                                    return <>For sale</>;
                                }
                                else {
                                    return <>
                                        Owned by
                                        {' ' /*force space between "owned by" and addresse*/}
                                        {
                                            itemAsPenguin ?
                                                <AddressWrapper address={Address.fromBech32(itemAsPenguin.owner)} />
                                                :
                                                <SpinningLoad />
                                        }
                                    </>
                                }
                            })()
                        }

                    </p>
                </div>;

            case 'items':
                return isConnected && <>
                    <span className={style.primary}>{item?.amount ?? '--'}</span> owned<br />
                    <span className={style.primary}>{ownedOffers?.length ?? '--'}</span> on sale by you
                </>

            default:
                throw new Error('Unknown type');
        }
    }

    async function sell(price: BigNumber) {

        const transaction: SimpleTransactionType = getSellTransaction(price);
        await refreshAccount();

        await sendTransactions({
            transactions: transaction,
            transactionDisplayInfo: {
                processingMessage: 'Listing',
                errorMessage: 'An error has occured during listing',
                successMessage: 'Listed successful'
            },
            redirectAfterSign: false
        });
    }

    function getTypeInText() {
        switch (category) {
            case 'penguins':
                return {
                    singular: 'Penguin',
                    plural: 'Penguins'
                };

            case 'items':
                return {
                    singular: 'Item',
                    plural: 'Items'
                };

            default:
                throw new Error('Unknown type');
        }
    }
}

export default Inspect;