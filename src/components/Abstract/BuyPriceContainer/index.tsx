import * as React from 'react';
import LoginButton from 'components/Buttons/LoginButton/LoginButton';
import Price from 'sdk/classes/Price';
import useIsConnected from 'sdk/hooks/dapp-core-upgraded/useIsConnected';
import Button from '../Button/Button';
import style from './style.module.scss';

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

    const isConnected = useIsConnected();

    return (
        <section className={style.buy + ' ' + className}>

            <h2>Price</h2>

            {
                offersCount == undefined || offersCount > 0 ?
                    <>
                        <p className={style.price}>{price?.toDenomination() ?? '--'} EGLD</p>

                        {
                            isConnected ?

                                <Button onClick={onBuy} type='primary' className={style.button}>
                                    Buy
                                </Button>
                                :
                                <LoginButton className={style.button} />
                        }

                        {showOffersCount &&
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