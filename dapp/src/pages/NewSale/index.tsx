import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import SendTransactionButton from 'components/Buttons/SendTransactionButton';
import ItemPageLayout from 'components/Layout/ItemPageLayout';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import Price from 'sdk/classes/Price';
import useGetNewSaleInfo from 'sdk/hooks/api/useGetNewSaleInfo';
import style from './index.module.scss';

const NewSale = () => {

    const { id } = useParams();
    if (!id) throw new Error('Missing ID');

    const { data: newSaleInfo } = useGetNewSaleInfo(id);
    console.log(newSaleInfo?.item);
    const price = newSaleInfo ? new Price(newSaleInfo.price, newSaleInfo.token.decimals) : undefined;

    return <>
        <MobileHeader title={'New Sale ' + (newSaleInfo?.item.displayName ?? '')} type='light' />

        <ItemPageLayout
            itemData={newSaleInfo ? { url: newSaleInfo.item.url, displayName: newSaleInfo.item.displayName } : undefined} >

            {newSaleInfo ?
                <div className={style['buyContainer']}>

                    <p className={style.price}>
                        {price?.toDenomination() ?? <Skeleton />} {newSaleInfo.token.symbol}
                    </p>

                    <SendTransactionButton
                        sendBtnLabel="Buy"
                        onSend={onBuy}
                        unlockTimestamp={newSaleInfo.startTimestamp}
                        className={style.button} />

                    <div className="mt-2">
                        {newSaleInfo.remainingSupply} {newSaleInfo.item.displayName} remaining
                    </div>
                </div>
                :
                <Skeleton />
            }

        </ItemPageLayout >
    </>;

    function onBuy() {
        console.warn('OnBuy no implemented yet');
    }
}

export default NewSale;

