import * as React from 'react';
import { IItem, IOffer, IPenguin } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import { SimpleTransactionType } from '@elrondnetwork/dapp-core/types';
import { refreshAccount } from '@elrondnetwork/dapp-core/utils';
import { useParams } from 'react-router-dom';
import Button from 'components/Abstract/Button/Button';
import BuyPriceContainer from 'components/Abstract/BuyPriceContainer/BuyPriceContainer';
import BuyingPopup from 'components/Foreground/Popup/BuyingPopup/BuyingPopup';
import ShowOffersPopup from 'components/Foreground/Popup/ShowOffersPopup';
import ShareIcon from 'components/Icons/ShareIcon';
import ItemSubProperties from 'components/InspectSubProperties/ItemSubProperties';
import PenguinSubProperties from 'components/InspectSubProperties/PenguinSubProperties';
import ItemsAndActivities from 'components/Inventory/ItemsAndActivities/ItemsAndActivities';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import { ipfsGateway, marketplaceContractAddress } from 'config';
import { buildRouteLinks } from 'routes';
import Price from 'sdk/classes/Price';
import useGetOffers from 'sdk/hooks/api/useGetOffers';
import useGetUserOwnedAmount from 'sdk/hooks/api/useGetUserOwnedAmount';
import useInspect from 'sdk/hooks/useInspect';
import BuyOfferTransactionBuilder from 'sdk/transactionsBuilders/buy/BuyOfferTransactionBuilder';
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


    const userInventory = useGetUserOwnedAmount();
    const itemOwnedAmount = userInventory && (userInventory[category][id] ?? 0);

    const ownedByConnectedWallet = (() => {

        if (item != undefined && itemOwnedAmount != undefined && itemOwnedAmount > 0) {
            return true;
        }
        else if (ownedOffers != undefined) {
            return ownedOffers.find(offer => offer.seller == connectedAddress) != undefined;
        }
        else {
            return undefined;
        }
    })();

    const canBuy = category == 'items' || (category == 'penguins' && ownedByConnectedWallet == false);
    const typeInText = getTypeInText();
    const buyableOffersCount = buyableOffers?.length;

    return (
        <div id={style['item-in-inventory']}>
            <MobileHeader title={typeInText.plural} type='light' />
            <div className={style.thumbnail}>
                <img src={item ? (ipfsGateway + item.thumbnailCID) : ''} alt={item?.name ?? 'loading item'} />
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
                    {getSubProperties()}
                </div>
            </div>
            <div>

                {canBuy &&
                    <BuyPriceContainer
                        price={lowestBuyableOffer ? Price.fromEgld(lowestBuyableOffer.price) : undefined}
                        onBuy={() => {
                            if (!lowestBuyableOffer) throw new Error('No offer to buy');
                            sendBuyOfferTransaction(lowestBuyableOffer)
                        }}
                        offersCount={buyableOffersCount}
                        showOffersCount={category != 'penguins'}  /* don't show offers count for penguins because we can only have one offer max per penguin */
                    />
                }



                {ownedByConnectedWallet == true &&
                    <div className={style.actions}>
                        {
                            (itemOwnedAmount != undefined && itemOwnedAmount > 0) &&
                            <div>
                                <Button type='normal' onClick={() => { setIsSellPopupOpen(true) }}>
                                    Sell
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
                                        <p className={'text-center mt-1'}>
                                            Listed for {priceListedByUser.toString() ?? '--'} EGLD
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
                    </div>
                }
            </div>
            <hr />
            <ItemsAndActivities
                items={(item != undefined && category == 'penguins') ? Object.values((item as IPenguin).equippedItems) : []}
                activities={activities}
                className={style.activity} />

            {
                (item) &&
                <BuyingPopup
                    onClose={() => { setIsSellPopupOpen(false) }}
                    onSell={sell}
                    item={item}
                    type={category}
                    visible={isSellPopupOpen}
                    floorPrice={Price.fromEgld(lowestBuyableOffer?.price ?? '0')}
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

    async function sendBuyOfferTransaction(offer: IOffer) {
        const transaction: SimpleTransactionType = new BuyOfferTransactionBuilder()
            .setMarketplaceContract(marketplaceContractAddress)
            .setOffer(Object.assign(offer, { price: offer.price.toString() }))
            .build();

        await refreshAccount();

        await sendTransactions({
            transactions: transaction,
            transactionDisplayInfo: {
                processingMessage: 'Buying offer...',
                errorMessage: 'An error has occured during buying.',
                successMessage: 'Offer bought'
            },
            redirectAfterSign: false
        });
    }

    function getSubProperties() {

        if (!item) return;

        switch (category) {
            case 'penguins':
                return <PenguinSubProperties penguin={item as IPenguin} />

            case 'items':
                return <ItemSubProperties item={item as IItem} />

            default:
                throw new Error('Unknown type');
        }
    }

    async function sell(price: Price) {

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