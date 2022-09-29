import * as React from 'react';
import Price from 'sdk/classes/Price';
import Button from '../Button/Button';
import style from './buy-price-container.module.scss';

const BuyPriceContainer = ({
    className = '',
    price,
    showOffersCount = false,
    offersCount,
    onBuy = () => { /* do nothing*/ }
}: {
    className?: string,
    showOffersCount: boolean,
    offersCount: number | undefined,
    price?: Price,
    onBuy?: () => void
}) => {

    return (
        <section className={style.buy + ' ' + className}>

            <h2>Price</h2>

            {
                offersCount == undefined || offersCount > 0 ?
                    <>
                        <p className={style.price}>{price?.toDenomination() ?? '--'} EGLD</p>
                        <Button onClick={onBuy} type='primary' className={style.desktop + ' ' + style.button}>
                            Buy
                        </Button>
                        <Button onClick={onBuy} className={style.mobile + ' ' + style.button}>
                            Buy
                        </Button>

                        {showOffersCount &&
                            /* don't show offers count for penguins because we can only have one offer max per penguin */
                            <p className='mt-1'>{offersCount ?? '--'} offers</p>
                        }
                    </>
                    :
                    <p>No offers</p>
            }

        </section>
    );
};

export default BuyPriceContainer;