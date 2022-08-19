import * as React from 'react';
import Button from 'components/Button/Button';
import BuyingPopup from './BuyingPopup';
import { Item as ItemComponent } from './Item';
import style from './item-in-marketplace.module.scss';
import ItemsAndActivities from './ItemsAndActivities';
import SuccessPopup from './SuccessPopup';

const Page = (
    {
        data,
        type,
        activities,
        getActivities
    }: {
        data: any;
        type: string | undefined;
        activities: any;
        getActivities: () => void;
    }
) => {
    // buying popup
    const [buyingPopupIsVisible, setBuyingPopupIsVisible] = React.useState(false);

    const [successPopupIsVisible, setSuccessPopupIsVisible] = React.useState(false);

    function buyElmt() {
        // TODO: add method for buying element like item or penguin
        setBuyingPopupIsVisible(false);
        setSuccessPopupIsVisible(true);
    }

    return (
        <>
            <section className={style.thumbnail}>
                <img src={data.thumbnail} alt={data.name} />
            </section>
            <section className={style.infos}>
                <div className={style.right}>
                    <p className={style.name}>{data.name}</p>
                    <p className={style.price}>{data.price} EGLD</p>
                    <p className={style['owner-title']}>Owner</p>
                    <p className={style.owner}>{data.owner}</p>
                </div>
                <div className={style.left}>
                    {
                        data.rank &&
                        <p className={style.rank}>Rank #{data.rank}</p>
                    }
                    {
                        data.rarityScore &&
                        <p className={style['rarity-score']}>Rarity Score: {data.rarityScore}</p>
                    }
                </div>
            </section>
            <section className={style.buy}>
                <Button onClick={() => { setBuyingPopupIsVisible(true); }}>Buy for {data.price} EGLD</Button>
            </section>
            <section className={style['item-and-activity']}>
                <ItemsAndActivities getActivities={getActivities} items={data.items ? data.items : []} activities={activities} />
            </section>

            <BuyingPopup visible={buyingPopupIsVisible} className={style['buying-popup'] + ' ' + style[type ?? 'penguin']} closePopup={() => setBuyingPopupIsVisible(false)}>
                {
                    type === 'item' ? (
                        <>
                            <section>
                                <h2>Buy item</h2>
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
                                            <div className={style.label}>Penguin Id</div>
                                            <div className={style.value}>{data.name}</div>
                                        </div>
                                        <div className={style.line}>
                                            <div className={style.label}>Owner</div>
                                            <div className={style.value + ' ' + style.owner}>erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3</div>
                                        </div>
                                        <div className={style.line}>
                                            <div className={style.label}>Price</div>
                                            <div className={style.value}>8 EGLD</div>
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
                    <h3>Total</h3>
                    <div className={style.price}>{data.price} EGLD</div>
                    <Button className={style.button} onClick={buyElmt}>Buy</Button>
                </section>
            </BuyingPopup>
            <SuccessPopup isVisible={successPopupIsVisible} />
        </>
    );
};

export default Page;