import * as React from 'react';
import { useParams } from 'react-router-dom';
import Button from 'components/Button/Button';
import ShareIcon from 'components/Icons/ShareIcon';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import BuyingPopup from 'pages/Marketplace/ItemInMarketplace/BuyingPopup';
import ItemsAndActivities from 'pages/Marketplace/ItemInMarketplace/ItemsAndActivities';
import defaultPenguinImg from './../../../assets/img/penguin_default.png';
import { Item as ItemComponent } from './../../Marketplace/ItemInMarketplace/Item';
import style from './item-in-inventory.module.scss';
import SetPrice from './SetPrice';

const ItemInInventory = () => {
    const { type, id } = useParams();

    const typeInText = type ? type.charAt(0).toUpperCase() + type.slice(1) : '???';

    // get data of item
    const [data, getData] = React.useState<any>({
        name: '',
        thumbnail: defaultPenguinImg,
        items: []
    });

    React.useEffect(() => {
        // TODO: get from real api
        setTimeout(() => {
            getData({
                name: 'Penguin #0150',
                rank: 1,
                thumbnail: 'https://media.elrond.com/nfts/asset/QmPgz8q5oEXWaoPpaPEEefg7gmPGvrsTmrQ2fsB5ry7L8D',
                items: [
                    {
                        id: '0001',
                        type: 'background',
                        name: 'Oceanis Trench',
                        thumbnail: 'https://apc.mypinata.cloud/ipfs/QmTzCufPq9Aem3t14YLppf1Cqqu272ghaycQBdHrjG7Qog',
                        rarity: 2.6
                    },
                    {
                        id: '0002',
                        type: 'beack',
                        name: 'Hook',
                        thumbnail: 'https://apc.mypinata.cloud/ipfs/QmTzCufPq9Aem3t14YLppf1Cqqu272ghaycQBdHrjG7Qog',
                        rarity: 25.8
                    },
                    {
                        id: '0003',
                        type: 'clothes',
                        name: 'Lifeguard T-shirt',
                        thumbnail: 'https://apc.mypinata.cloud/ipfs/QmTzCufPq9Aem3t14YLppf1Cqqu272ghaycQBdHrjG7Qog',
                        rarity: 2
                    },
                    {
                        id: '0004',
                        type: 'eyes',
                        name: 'Wounded',
                        thumbnail: 'https://apc.mypinata.cloud/ipfs/QmTzCufPq9Aem3t14YLppf1Cqqu272ghaycQBdHrjG7Qog',
                        rarity: 8.5
                    },
                    {
                        id: '0005',
                        type: 'hat',
                        name: 'EGLD Headscarf',
                        thumbnail: 'https://apc.mypinata.cloud/ipfs/QmTzCufPq9Aem3t14YLppf1Cqqu272ghaycQBdHrjG7Qog',
                        rarity: 2.3
                    },
                    {
                        id: '0006',
                        type: 'skin',
                        name: 'unequipped',
                        thumbnail: 'https://apc.mypinata.cloud/ipfs/QmTzCufPq9Aem3t14YLppf1Cqqu272ghaycQBdHrjG7Qog',
                        rarity: 37
                    },
                    {
                        id: '0007',
                        type: 'weapon',
                        name: 'Flamethrower',
                        thumbnail: 'https://apc.mypinata.cloud/ipfs/QmTzCufPq9Aem3t14YLppf1Cqqu272ghaycQBdHrjG7Qog',
                        rarity: 0.9
                    }
                ]
            }/*
                {
                    id: '0001',
                    type: 'background',
                    name: 'Oceanis Trench',
                    thumbnail: 'https://apc.mypinata.cloud/ipfs/QmTzCufPq9Aem3t14YLppf1Cqqu272ghaycQBdHrjG7Qog',
                    rank: 1,
                    rarity: 2.6
                }*/);
        }, 666);
    }, []);

    // activity tab
    interface Activity {
        id: string;
        price: number;
        from: string;
        to: string;
        date: string;
    }
    const [activities, setActivities] = React.useState<Activity[]>([]);

    function getActivities() {
        // TODO: simulate api call
        setTimeout(() => {
            setActivities([
                {
                    id: '1ba48da9bdf8224dbbe0fbe85a51d27d3075620278e8e0af666788a3d857cd30',
                    price: 5,
                    from: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    to: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    date: '2020-01-01'
                },
                {
                    id: '1ba48da9bdf8224dbbe0fbe85a51d27d3075620278e8e0af666788a3d857cd31',
                    price: 5,
                    from: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    to: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    date: '2020-01-01'
                },
                {
                    id: '1ba48da9bdf8224dbbe0fbe85a51d27d3075620278e8e0af666788a3d857cd32',
                    price: 5,
                    from: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    to: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    date: '2020-01-01'
                },
                {
                    id: '1ba48da9bdf8224dbbe0fbe85a51d27d3075620278e8e0af666788a3d857cd33',
                    price: 5,
                    from: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    to: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    date: '2020-01-01'
                },
                {
                    id: '1ba48da9bdf8224dbbe0fbe85a51d27d3075620278e8e0af666788a3d857cd34',
                    price: 5,
                    from: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    to: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    date: '2020-01-01'
                }
            ]);
        }, 750);
    }

    // TODO: get by api is penguin is in market
    const [isInMarket, setIsInMarket] = React.useState(false);
    const [priceInMarket, setPriceInMarket] = React.useState(0);

    React.useEffect(() => {
        // TODO: simulate api call
        setTimeout(() => {
            setIsInMarket(false);
        }, 500);
    }, []);

    // sell popup
    const [isSellPopupOpen, setIsSellPopupOpen] = React.useState(false);

    // get  price
    const [floorPrice, setFloorPrice] = React.useState(0);
    const [price, setPrice] = React.useState('0');

    React.useEffect(() => {
        // TODO: simulate api call
        setTimeout(() => {
            const tmpFloorPrice = 5;
            setFloorPrice(tmpFloorPrice);
            setPrice(tmpFloorPrice.toString());
        }, 500);
    }, []);

    return (
        <div id={style['item-in-inventory']}>
            <MobileHeader title={typeInText} type='light' />
            <div className={style.thumbnail}>
                <img src={data.thumbnail} alt={data.name} />
            </div>
            <div className={style.infos}>
                <p className={style.name}>{data.name}</p>
                <div className={style.share} onClick={() => {
                    window.navigator.share({
                        title: data.name,
                        text: 'Check out this item Angry Penguin Marketplace',
                        url: window.location.href,
                    })
                }}>
                    <ShareIcon />
                </div>
                <div className={style.rank}>Rank <span className={style.primary}>#{data.rank}</span></div>
            </div>
            <div className={style.actions + (isInMarket ? ' ' + style['in-market'] : '')}>
                {
                    isInMarket ? (
                        <>
                            <Button type='cancel-outline'>Retire offer</Button>
                            <p className={style.price}>Listed for {priceInMarket} EGLD</p>
                        </>
                    ) : (
                        <>
                            <Button type='normal' onClick={() => { setIsSellPopupOpen(true) }}>Sell {typeInText}</Button>
                            {
                                type === 'penguin' &&
                                <Button type='primary' onClick={() => {
                                    window.location.href = '/customize/' + id;
                                }}>Customize</Button>
                            }
                        </>
                    )
                }
            </div>
            <hr />
            <ItemsAndActivities getActivities={getActivities} items={data.items ? data.items : []} activities={activities} className={style.activity} />
            <BuyingPopup closePopup={() => { setIsSellPopupOpen(false) }} visible={isSellPopupOpen} className={style['buying-popup'] + ' ' + style[type ?? 'penguin']}>
                {
                    type === 'item' ? (
                        <>
                            <section>
                                <h2>Sell item</h2>
                                <img src={data.thumbnail} alt={data.name} />
                                <div className={style.infos}>
                                    <div className={style.line}>
                                        <div className={style.label}>Item Id</div>
                                        <div className={style.value}>{data.name}</div>
                                    </div>
                                    <div className={style.line}>
                                        <div className={style.label}>Price</div>
                                        <div className={style.value}>{data.price} EGLD</div>
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
                                    <img src={data.thumbnail} alt={data.name} />
                                    <div className={style.infos}>
                                        <div className={style.line}>
                                            <div className={style.label}>Penguin ID</div>
                                            <div className={style.value}>{data.name}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={style['items-attached']}>
                                    <h3>Items attached to the penguin</h3>
                                    <div className={style.content}>
                                        {data.items.map((aItem: any) => {
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
                <section>
                    {
                        type === 'penguin' &&
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
}

export default ItemInInventory;