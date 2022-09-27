import * as React from 'react';
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
import ShareIcon from 'components/Icons/ShareIcon';
import ItemsAndActivities from 'components/Inventory/ItemsAndActivities/ItemsAndActivities';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import SpinningLoad from 'components/SpinningLoad';
import { items, marketplaceContractAddress, penguinCollection } from 'config';
import { buildRouteLinks } from 'routes';
import useGetActivity from 'sdk/hooks/api/useGetActivity';
import useGetOffersOfCategory from 'sdk/hooks/api/useGetOffersOfCategory';
import useGetPenguin from 'sdk/hooks/api/useGetPenguin';
import { SellPayloadBuilder } from 'sdk/transactionsBuilders/sell/SellPayloadBuilder';
import CategoriesType from 'sdk/types/CategoriesType';
import { useGetGenericItem } from '../../sdk/hooks/api/useGetGenericItem';
import style from './index.module.scss';

const Inspect = () => {
    const params = useParams();
    const id = params.id;
    const type = params.type as CategoriesType;

    if (!type) throw new Error('type is required');
    if (!id) throw new Error('Item id is required');

    const { address: connectedAddress } = useGetAccountInfo();
    const { item, ownedByConnectedWallet } = useGetGenericItem(type, id);

    const activities = useGetActivity(type, id);
    const penguin = useGetPenguin(id); // TODO: FIX 404 error in /items path
    const isInMarket = false; // TODO: fill it
    const [priceInMarket] = React.useState(0);

    const rawOffers = useGetOffersOfCategory(type);
    console.log('rawOffers', rawOffers);

    const typeInText = getTypeInText();

    // sell popup
    const [isSellPopupOpen, setIsSellPopupOpen] = React.useState(false);

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
            <div className={style.actions + (isInMarket ? ' ' + style['in-market'] : '')}>
                {ownedByConnectedWallet == true &&
                    <>
                        {
                            isInMarket ? (
                                <>
                                    <Button type='cancel-outline'>Retire offer</Button>
                                    <p className={style.price}>Listed for {priceInMarket} EGLD</p>
                                </>
                            ) : (
                                <>
                                    {
                                        item && item.amount > 0 &&
                                        <Button type='normal' onClick={() => { setIsSellPopupOpen(true) }}>
                                            Sell {typeInText.singular}
                                        </Button>
                                    }
                                    {
                                        type === 'penguins' &&
                                        <Button type='primary' onClick={() => {
                                            window.location.href = buildRouteLinks.customize(id);
                                        }}>Customize</Button>
                                    }
                                </>
                            )
                        }
                    </>
                }
            </div>
            <hr />
            <ItemsAndActivities items={item?.items ?? []} activities={activities} className={style.activity} />

            {item &&
                <BuyingPopup
                    onClose={() => { setIsSellPopupOpen(false) }}
                    onSell={sell}
                    item={item}
                    type={type}
                    visible={isSellPopupOpen}
                />
            }
        </div>
    );

    function getOwnedProperty() {

        if (!item) return;

        switch (type) {
            case 'penguins':

                return <div className={style['owned-property']}>
                    <p className={style['owned-property-text']}>
                        {
                            (() => {
                                if (penguin && penguin.owner == marketplaceContractAddress.bech32()) {
                                    return <>For sale</>;
                                }
                                else {
                                    return <>
                                        Owned by
                                        {' ' /*force space between "owned by" and addresse*/}
                                        {
                                            penguin ?
                                                <AddressWrapper address={Address.fromBech32(penguin.owner)} />
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
                return <>
                    <span className={style.primary}>{item?.amount ?? '--'}</span> owned
                </>

            default:
                throw new Error('Unknown type');
        }
    }

    async function sell(price: BigNumber) {

        const { collection, nonce } = await getToken();
        const payload = new SellPayloadBuilder()
            .setPrice(price)
            .setMarketplaceSc(marketplaceContractAddress)
            .setToken(collection, nonce)
            .build();

        const transaction: SimpleTransactionType = {
            value: '0',
            data: payload.toString(),
            receiver: connectedAddress,
            gasLimit: 50_000_000,
        };

        await refreshAccount();

        await sendTransactions({
            transactions: transaction,
            transactionDisplayInfo: {
                processingMessage: 'Processing customization transaction',
                errorMessage: 'An error has occured during customization',
                successMessage: 'Customization transaction successful'
            },
            redirectAfterSign: false
        });


        async function getToken() {
            switch (type) {
                case 'penguins':

                    if (!penguin) throw new Error('id is required');

                    return {
                        collection: penguinCollection,
                        nonce: penguin.nonce // id is the nonce
                    };

                case 'items':
                    const foundItem = items.find(i => i.id == id);

                    if (!foundItem) throw new Error('Item not found');

                    return {
                        collection: foundItem.collection,
                        nonce: foundItem.nonce
                    };

                default:
                    throw new Error('Unknown type');
            }
        }
    }

    function getTypeInText() {
        switch (type) {
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