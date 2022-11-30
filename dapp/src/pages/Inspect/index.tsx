import * as React from 'react';
import { IItem, IOffer, IPenguin } from '@apcolony/marketplace-api';
import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import { SimpleTransactionType } from '@elrondnetwork/dapp-core/types';
import { refreshAccount } from '@elrondnetwork/dapp-core/utils';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import Button from 'components/Abstract/Button/Button';
import BuyPriceContainer from 'components/Abstract/BuyPriceContainer';
import ErrorPage from 'components/ErrorPage';
import BuyingPopup from 'components/Foreground/Popup/BuyingPopup/BuyingPopup';
import ShowMyOffersPopup from 'components/Foreground/Popup/ShowMyOffersPopup';
import ShowOffersPopup from 'components/Foreground/Popup/ShowOffersPopup';
import ShareIcon from 'components/Icons/ShareIcon';
import ItemSubProperties from 'components/InspectSubProperties/ItemSubProperties';
import PenguinSubProperties from 'components/InspectSubProperties/PenguinSubProperties';
import ItemsAndActivities from 'components/Inventory/ItemsAndActivities/ItemsAndActivities';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import { hatchLink, marketplaceContractAddress } from 'config';
import { buildRouteLinks } from 'routes';
import Price from 'sdk/classes/Price';
import useInspect from 'sdk/hooks/useInspect';
import { isCategoryValid, isIdValid } from 'sdk/misc/guards';
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
        getRetireTransaction,
        ownedOrListedByConnectedWallet,
        canBuy,
        offers,
        lowestBuyableOffer,
        priceListedByUser,
        buyableOffers,
        ownedOffers,
        isOwnedByConnected,
        isListedByConnected,
        floorPrice
    } = useInspect(category, id);


    const [isSellPopupOpen, setIsSellPopupOpen] = React.useState(false);
    const [isMyOffersPopupOpen, showMyOffersPopup] = React.useState(false);
    const [isOffersPopupOpen, showOffersPopup] = React.useState(false);



    const typeInText = getTypeInText();

    return (
        <div id={style['item-in-inventory']}>
            <MobileHeader title={typeInText.plural} type='light' />
            <div className={style.thumbnail}>
                {
                    item ?
                        <img className={style.img} src={item.thumbnailUrls.high} alt={item.displayName} />
                        :
                        <Skeleton height={250} />
                }
            </div>
            <div className={style.infos}>
                <p className={style.name}>{item?.displayName ?? <Skeleton />}</p>
                <div className={style.share} onClick={() => {
                    if (!item) return;
                    window.navigator.share({
                        title: item.displayName,
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
                        buyableOffersCount={buyableOffers?.length}
                        onBuy={() => {
                            if (!lowestBuyableOffer) throw new Error('No offer to buy');
                            sendBuyOfferTransaction(lowestBuyableOffer)
                        }}
                        offersCount={offers?.length}
                        showOffersCount={category != 'penguins'}  /* don't show offers count for penguins because we can only have one offer max per penguin */
                        onOffersCountClick={() => showOffersPopup(true)}
                    />
                }



                {ownedOrListedByConnectedWallet == true &&
                    <div className={style.actions}>
                        {
                            (isOwnedByConnected) &&
                            <div>
                                <Button type='normal' onClick={() => { setIsSellPopupOpen(true) }}>
                                    Sell
                                </Button>
                            </div>
                        }

                        {
                            (isOwnedByConnected && category == 'eggs') &&
                            <div>
                                <a href={hatchLink} target="_blank" rel="noopener noreferrer">

                                    <Button type='normal'>
                                        Hatch
                                    </Button>
                                </a>
                            </div>
                        }

                        {
                            (category === 'penguins' && !isListedByConnected) &&
                            <Button type='primary' link={buildRouteLinks.customize(id)}>
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

                                            <Button type='normal' onClick={() => showMyOffersPopup(true)}>
                                                View my {ownedOffers.length} offers
                                            </Button>
                                        </div>
                                    </>
                                }

                            })()
                        }
                    </div>
                }
                <hr />
            </div>
            <ItemsAndActivities
                items={getItems()}
                activities={activities}
                type={getTypeInText().singular.toLowerCase()}
                disableActivityTab={category == 'penguins'}
                disableItemsTab={category != 'penguins'}
                className={style.activity} />

            {
                (item) &&
                <BuyingPopup
                    onClose={() => { setIsSellPopupOpen(false) }}
                    onSell={sell}
                    item={item}
                    type={category}
                    visible={isSellPopupOpen}
                    floorPrice={floorPrice}
                />
            }
            {
                ownedOffers &&
                <ShowMyOffersPopup
                    offers={ownedOffers}
                    isVisible={isMyOffersPopupOpen}
                    onCloseClicked={() => { showMyOffersPopup(false) }}
                    onRetire={sendRetireOfferTransaction}
                />
            }
            {offers &&
                <ShowOffersPopup
                    offers={offers}
                    isVisible={isOffersPopupOpen}
                    onCloseClicked={() => { showOffersPopup(false) }}
                />
            }
        </div >
    );

    function getItems() {
        if (!item) return undefined;

        switch (category) {
            case 'penguins':
                return Object.values((item as IPenguin).equippedItems);

            case 'items':
            case 'eggs':
                return [];

            default:
                throw new Error('Unknown category');
        }
    }

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

        if (!item) return <Skeleton />;

        switch (category) {
            case 'penguins':
                return <PenguinSubProperties offer={offers ? offers[0] : undefined} penguin={item as IPenguin} />

            case 'items':
            case 'eggs':
                return <ItemSubProperties ice={(item as IItem).stakePoints} ownedAmount={item.ownedAmount ?? 0} supply={(item as IItem).supply} />

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

            case 'eggs':
                return {
                    singular: 'Egg',
                    plural: 'Eggs'
                }

            default:
                throw new Error('Unknown type');
        }
    }
}

const InspectErrorWrapper = () => {

    const params = useParams();
    const category = params.type as CategoriesType;
    const id = params.id;

    if (!category) throw new Error('type is required');
    if (!id) throw new Error('Item id is required');

    if (isCategoryValid(category) == false) {
        return <ErrorPage
            title='Unknown category'
            description=""
        />
    }
    else if (isIdValid(id, category) == false) {
        return <ErrorPage
            title='Unknown ID'
            description=""
        />
    }
    else {
        return <Inspect />
    }
};

export default InspectErrorWrapper;