import * as React from 'react';
import { IGenericElement, IPenguin } from '@apcolony/marketplace-api';
import Button from 'components/Abstract/Button/Button';
import CrossIcon from 'components/Icons/CrossIcon';
import { Item } from 'components/Inventory/Item/Item';
import SetPrice from 'components/Inventory/SetPrice/SetPrice';
import Price from 'sdk/classes/Price';
import CategoriesType from 'sdk/types/CategoriesType';
import style from './BuyingPopup.module.scss';

const BuyingPopup = (
    {
        onClose,
        onSell,
        visible = false,
        item,
        floorPrice,
        type
    }: {
        visible?: boolean;
        onClose: () => void;
        onSell: (price: Price) => void;
        item: IGenericElement;
        floorPrice: Price;
        type: CategoriesType;
    }
) => {
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
                            <section> <div className={style.close} onClick={onClose}>
                                <CrossIcon className={style.icon} />
                            </div>
                                <h2>Sell item</h2>
                                <img src={item.thumbnailUrls.high} alt={item.name} />
                                <div className={style.infos}>
                                    <div className={style.line}>
                                        <div className={style.label}>Item</div>
                                        <div className={style.value}>{item.name}</div>
                                    </div>
                                </div>
                                <SetPrice floorPrice={floorPrice} price={price} setPrice={setPrice} className={style['set-price']} />
                            </section>
                        </>
                    ) : (
                        <>
                            <section> <div className={style.close} onClick={onClose}>
                                <CrossIcon className={style.icon} />
                            </div>
                                <h2>Sell</h2>
                                <img src={item.thumbnailUrls.high} alt={item.name} />
                                <div className={style['items-attached']}>
                                    <h3>Items attached to the penguin</h3>
                                    <div className={style.content}>
                                        {Object.values((item as IPenguin).equippedItems).map((aItem: any) => {
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
                <Button className={style.button} onClick={() => onSell(Price.fromEgld(price))}>Place on the market</Button>
            </section>
        </div>
    </div>
};

export default BuyingPopup;