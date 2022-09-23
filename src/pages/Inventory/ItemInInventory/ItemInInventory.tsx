import * as React from 'react';
import { IItem, IPenguin } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { useParams } from 'react-router-dom';
import BuyingPopup from 'components/AboveComponents/Popup/BuyingPopup/BuyingPopup';
import Button from 'components/Button/Button';
import ShareIcon from 'components/Icons/ShareIcon';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import { ipfsGateway } from 'config';
import { Item as ItemComponent } from 'pages/Marketplace/ItemInMarketplace/Item/Item';
import ItemsAndActivities from 'pages/Marketplace/ItemInMarketplace/ItemsAndActivities/ItemsAndActivities';
import useGenericAPICall from 'sdk/hooks/api/useGenericAPICall';
import useGetActivity from 'sdk/hooks/api/useGetActivity';
import useGetOffers from 'sdk/hooks/api/useGetOffers';
import style from './ItemInInventory.module.scss';
import SetPrice from './SetPrice/SetPrice';


interface Data {
    name: string,
    thumbnail: string,
    items: IItem[],
    rank: number,
    price: number,
}

type ItemType = 'penguins' | 'items';

const ItemInInventory = () => {
    const params = useParams();
    const id = params.id;
    const type = params.type as ItemType;

    if (!type) throw new Error('type is required');
    if (!id) throw new Error('Item id is required');

    const { item, ownedByConnectedWallet } = useGetData(type, id);
    const activities = useGetActivity(type, id);
    const offers = useGetOffers(type, id);
    const isInMarket = offers ? offers.length > 0 : undefined;
    const [priceInMarket] = React.useState(0);
    const [floorPrice] = React.useState(0);
    const [price, setPrice] = React.useState('0');

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
                <div className={style.rank}>Rank <span className={style.primary}>#{item?.rank ?? '----'}</span></div>
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
                                    <Button type='normal' onClick={() => { setIsSellPopupOpen(true) }}>Sell {typeInText.singular}</Button>
                                    {
                                        type === 'penguins' &&
                                        <Button type='primary' onClick={() => {
                                            window.location.href = '/customize/' + id;
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
            <BuyingPopup closePopup={() => { setIsSellPopupOpen(false) }} visible={isSellPopupOpen} className={style['buying-popup'] + ' ' + style[type ?? 'penguin']}>
                {
                    item &&
                    <>
                        {
                            type === 'items' ? (
                                <>
                                    <section>
                                        <h2>Sell item</h2>
                                        <img src={item.thumbnail} alt={item.name} />
                                        <div className={style.infos}>
                                            <div className={style.line}>
                                                <div className={style.label}>Item Id</div>
                                                <div className={style.value}>{item.name}</div>
                                            </div>
                                            <div className={style.line}>
                                                <div className={style.label}>Price</div>
                                                <div className={style.value}>{item.price} EGLD</div>
                                            </div>
                                        </div>
                                        <SetPrice floorPrice={floorPrice} price={price} setPrice={setPrice} className={style['set-price']} />
                                    </section>
                                </>
                            ) : (
                                <>
                                    <section>
                                        <h2>Checkout</h2>
                                        <div className={style.infos}>
                                            <img src={item.thumbnail} alt={item.name} />
                                            <div className={style.infos}>
                                                <div className={style.line}>
                                                    <div className={style.label}>Penguin ID</div>
                                                    <div className={style.value}>{item.name}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={style['items-attached']}>
                                            <h3>Items attached to the penguin</h3>
                                            <div className={style.content}>
                                                {item.items.map((aItem: any) => {
                                                    return (
                                                        <ItemComponent key={aItem.id} item={aItem} />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </section>
                                </>
                            )
                        }
                    </>
                }
                <section>
                    {
                        type === 'penguins' &&
                        <SetPrice floorPrice={floorPrice} price={price} setPrice={setPrice} className={style['set-price']} />
                    }
                    <Button className={style.button} onClick={() => {
                        // TODO: buy item
                        setIsSellPopupOpen(false);
                    }}>Place on the market</Button>
                </section>
            </BuyingPopup>
        </div>
    );

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

function useGetData(type: ItemType, id: string) {

    const [data, setData] = React.useState<Data | undefined>(undefined);
    const [ownedByConnected, setOwnedByConnected] = React.useState<boolean | undefined>(undefined);

    const raw = useGenericAPICall<any>(`${type}/${id}`);
    const { address: connectedAddress } = useGetAccountInfo();

    React.useEffect(() => {

        if (!raw) return;

        switch (type) {
            case 'penguins':
                const penguin = raw as IPenguin;

                setData({
                    name: penguin.name,
                    thumbnail: ipfsGateway + penguin.thumbnailCID,
                    items: Object.values(penguin.equippedItems),
                    rank: -1,
                    price: -1
                });

                setOwnedByConnected(penguin.owner == connectedAddress);
                break;

            case 'items':
                const item = raw as IItem;

                setData({
                    name: item.name,
                    thumbnail: ipfsGateway + item.thumbnailCID,
                    items: [],
                    rank: -1,
                    price: -1,
                })

                setOwnedByConnected(item.amount > 0);
                break;

            default:
                throw new Error('Invalid type');
        }

    }, [raw, type, id])

    return {
        item: data,
        ownedByConnectedWallet: ownedByConnected
    };
}


export default ItemInInventory;