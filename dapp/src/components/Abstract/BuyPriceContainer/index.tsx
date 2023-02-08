import * as React from 'react';
import Skeleton from 'react-loading-skeleton';
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
    onOffersCountClick,
    buyableOffersCount,
    tokenName = 'EGLD',
    showTitle = true
}: {
    className?: string,
    showOffersCount: boolean,
    offersCount: number | undefined,
    buyableOffersCount: number | undefined,
    price?: Price,
    onBuy?: () => void,
    onOffersCountClick?: () => void,
    tokenName?: string;
    showTitle?: boolean
}) => {

    const isConnected = useIsConnected();

    return (
        <section className={style.buy + ' ' + className}>

            {showTitle &&
                <h2>Price</h2>
            }

            {
                buyableOffersCount == undefined || buyableOffersCount > 0 ?
                    <>
                        <p className={style.price}>
                            {price?.toDenomination() ?? <Skeleton />} {tokenName}
                        </p>

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
                                {
                                    offersCount != undefined &&
                                    <>
                                        {offersCount} offers

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
                                    </>
                                }
                            </span>
                        }
                    </>
                    :
                    <p>No buyables offers</p>
            }

        </section>
    );
};

export default BuyPriceContainer;