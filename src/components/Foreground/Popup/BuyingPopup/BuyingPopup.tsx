import * as React from 'react';
import Button from 'components/Abstract/Button/Button';
import CrossIcon from 'components/Icons/CrossIcon';
import { Item } from 'components/Inventory/Item/Item';
import SetPrice from 'components/Inventory/SetPrice/SetPrice';
import CategoriesType from 'sdk/types/CategoriesType';
import { GenericItem } from 'sdk/types/GenericItem';
import style from './BuyingPopup.module.scss';

const BuyingPopup = (
    {
        onClose,
        onSell,
        visible = false,
        item,
        type
    }: {
        visible?: boolean;
        onClose: () => void;
        onSell: () => void;
        item: GenericItem;
        type: CategoriesType;
    }
) => {
    const [floorPrice] = React.useState(0);
    const [price, setPrice] = React.useState('0');

    const rootClassName = [
        style.popup,
        visible ? style.visible : '',
        style[type == 'penguins' ? 'penguin' : 'item']
    ].join(' ');


    return <div className={rootClassName}>
        <div className={style.content}>
            <div className={style.close} onClick={onClose}>
                <CrossIcon className={style.icon} />
            </div>

            {item &&
                <>
                    {type === 'items' ? (
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
                                                <Item key={aItem.id} item={aItem} />
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>
                        </>
                    )}
                </>}
            <section>
                {
                    type === 'penguins' &&
                    <SetPrice floorPrice={floorPrice} price={price} setPrice={setPrice} className={style['set-price']} />
                }
                <Button className={style.button} onClick={onSell}>Place on the market</Button>
            </section>
        </div>
    </div>
};

export default BuyingPopup;