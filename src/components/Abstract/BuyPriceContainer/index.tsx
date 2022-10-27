import * as React from 'react';
import ConnectWalletButton from 'components/Buttons/ConnectWalletButton';
import Price from 'sdk/classes/Price';
import useIsConnected from 'sdk/hooks/dapp-core-upgraded/useIsConnected';
import Button from '../Button/Button';
import style from './style.module.scss';

const BuyPriceContainer = ({
    className = '',
    price,
    showOffersCount = false,
    offersCount,
    onBuy = () => { /* do nothing*/ },
    onOffersCountClick
}: {
    className?: string,
    showOffersCount: boolean,
    offersCount: number | undefined,
    price?: Price,
    onBuy?: () => void
    onOffersCountClick?: () => void
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
                                <ConnectWalletButton className={style.button} />
                        }

                        {showOffersCount &&
                            <span className="mt-1">
                                {offersCount ?? '--'} offers

                                {
                                    onOffersCountClick &&
                                    <span className={style.seeOffers + ' ' + 'ml-1'} onClick={() => {
                                        if (onOffersCountClick) {
                                            onOffersCountClick();
                                        }
                                    }}>
                                        (show list)
                                    </span>
                                }
                            </span>
                        }
                    </>
                    :
                    <p>No offers</p>
            }

        </section>
    );
};

export default BuyPriceContainer;