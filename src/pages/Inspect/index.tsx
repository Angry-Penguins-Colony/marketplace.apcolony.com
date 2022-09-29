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
import { marketplaceContractAddress } from 'config';
import { buildRouteLinks } from 'routes';
import useGetOffers from 'sdk/hooks/api/useGetOffers';
import useInspect from 'sdk/hooks/useInspect';
import CategoriesType from 'sdk/types/CategoriesType';
import style from './index.module.scss';

/**
 * TODO: refactor this page
 * this inspect page has two responsabilities: show the item and show the penguin
 * 
 * It should be split in two pages, and one component:
 * - InspectLayout
 * - InspectItem
 * - InspectPenguins
 */

const Inspect = () => {
    const params = useParams();
    const category = params.type as CategoriesType;
    const id = params.id;

    if (!category) throw new Error('type is required');
    if (!id) throw new Error('Item id is required');

    const {
        item,
        ownedByConnectedWallet,
        activities,
        getSellTransaction,
        getRetireTransaction
    } = useInspect(category, id);

    const {
        buyableOffers,
        lowestBuyableOffer,
        priceListedByUser,
        ownedOffers,
        isListedByConnected
    } = useGetOffers(category, id);

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

                {!(category == 'penguins' && ownedByConnectedWallet) &&
                    <>
                        {
                            (() => {
                                if (lowestBuyableOffer == null) return <></>;

                                return <span className={style.price}>
                                    {/* TODO:  move new BigNumber((price.price as any).value) into useGetOffers*/}
                                    {lowestBuyableOffer != undefined ? new BigNumber((lowestBuyableOffer.price as any).value).toString() : '--'} EGLD
                                </span>
                            })()
                        }


                        {category != 'penguins' &&
                            /* don't show offers count for penguins because we can only have one offer max per penguin */
                            <p>{buyableOffers ? buyableOffers.length : '--'} offers</p>
                        }
                        <Button type="primary">
                            Buy
                        </Button>
                    </>
                }


                {ownedByConnectedWallet == true &&
                    <>
                        {
                            (item && item.amount != undefined && item.amount > 0) &&
                            <div>
                                <Button type='normal' onClick={() => { setIsSellPopupOpen(true) }}>
                                    Sell {typeInText.singular}
                                </Button>
                            </div>
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
                                    return <div>
                                        <Button type='cancel-outline' onClick={() => sendRetireOfferTransaction(ownedOffers[0])}>
                                            Retire my offer
                                        </Button>
                                        <p className={style.price + ' ' + 'text-center mt-1'}>
                                            Listed for {priceListedByUser ?? '--'} EGLD
                                        </p>
                                    </div >
                                }
                                else {
                                    return <>
                                        <div>

                                            <Button type='normal' onClick={() => setIsOffersPopupOpen(true)}>
                                                View my {ownedOffers.length} offers
                                            </Button>
                                        </div>
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
                    onRetire={sendRetireOfferTransaction}
                />
            }
        </div >
    );

    async function sendRetireOfferTransaction(offer: IOffer) {
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
                                if (!item.owner) return;

                                if (item.owner == marketplaceContractAddress.bech32()) {
                                    return <>For sale</>;
                                }
                                else {
                                    return <>
                                        Owned by {
                                            item.owner == connectedAddress ?
                                                'me' :
                                                <AddressWrapper address={Address.fromBech32(item.owner)} />
                                        }
                                    </>;
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