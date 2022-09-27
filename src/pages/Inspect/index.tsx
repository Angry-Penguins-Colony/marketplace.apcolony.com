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
import useInspect from 'sdk/hooks/useInspect';
import { SellPayloadBuilder } from 'sdk/transactionsBuilders/sell/SellPayloadBuilder';
import CategoriesType from 'sdk/types/CategoriesType';
import style from './index.module.scss';

const Inspect = () => {
    const params = useParams();
    const category = params.type as CategoriesType;
    const id = params.id;

    if (!category) throw new Error('type is required');
    if (!id) throw new Error('Item id is required');

    const { address: connectedAddress } = useGetAccountInfo();
    const isConnected = connectedAddress != '';
    const { item, isListedByConnected, ownedByConnectedWallet, priceListedByUser, activities, itemAsPenguin, ownedOffers } = useInspect(category, id);
    const [isSellPopupOpen, setIsSellPopupOpen] = React.useState(false);

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
                            isListedByConnected ?
                                (
                                    <>
                                        <Button type='cancel-outline'>Retire offer</Button>
                                        <p className={style.price}>Listed for {priceListedByUser ?? '--'} EGLD</p>
                                    </>
                                ) :
                                (
                                    <>
                                        {
                                            item && item.amount && item.amount > 0 &&
                                            <Button type='normal' onClick={() => { setIsSellPopupOpen(true) }}>
                                                Sell {typeInText.singular}
                                            </Button>
                                        }
                                        {
                                            category === 'penguins' &&
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
                    type={category}
                    visible={isSellPopupOpen}
                />
            }
        </div>
    );

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
                    <span className={style.primary}>{ownedOffers?.length ?? '--'}</span> on sale
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
            switch (category) {
                case 'penguins':

                    if (!itemAsPenguin) throw new Error('id is required');

                    return {
                        collection: penguinCollection,
                        nonce: itemAsPenguin.nonce // id is the nonce
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