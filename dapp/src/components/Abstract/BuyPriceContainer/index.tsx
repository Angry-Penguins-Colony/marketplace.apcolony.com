import * as React from 'react';
import Skeleton from 'react-loading-skeleton';
import SendTransactionButton from 'components/Buttons/SendTransactionButton';
import Price from 'sdk/classes/Price';
import style from './style.module.scss';

const BuyPriceContainer = ({
    className = '',
    price,
    showOffersCount = false,
    offersCount,
    onBuy = () => { /* do nothing*/ },
    onOffersCountClick,
    buyableOffersCount,
    tokenSymbol = 'EGLD',
    showTitle = true,
    unlockTimestamp
}: {
    className?: string,
    showOffersCount: boolean,
    offersCount: number | undefined,
    buyableOffersCount: number | undefined,
    price?: Price,
    onBuy?: () => void,
    onOffersCountClick?: () => void,
    tokenSymbol?: string;
    showTitle?: boolean;
    unlockTimestamp?: number
}) => {

    return (
        <section className={style.buy + ' ' + className}>

            {showTitle &&
                <h2>Price</h2>
            }

            {
                buyableOffersCount == undefined || buyableOffersCount > 0 ?
                    <>
                        <p className={style.price}>
                            {price?.toDenomination() ?? <Skeleton />} {tokenSymbol}
                        </p>

                        <SendTransactionButton
                            sendBtnLabel="Buy"
                            onSend={onBuy}
                            unlockTimestamp={unlockTimestamp}
                            className={style.button} />

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