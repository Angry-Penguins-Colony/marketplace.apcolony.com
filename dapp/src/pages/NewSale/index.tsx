import React, { useState } from 'react';
import { INewSaleData } from '@apcolony/marketplace-api';
import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import { refreshAccount } from '@elrondnetwork/dapp-core/utils';
import BigNumber from 'bignumber.js';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import NumberInput from 'components/Buttons/NumberInput';
import SendTransactionButton from 'components/Buttons/SendTransactionButton';
import ItemPageLayout from 'components/Layout/ItemPageLayout';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import { newSalesContract } from 'config';
import Price from 'sdk/classes/Price';
import useGetNewSaleInfo from 'sdk/hooks/api/useGetNewSaleInfo';
import BuyNewSaleTransactionBuilder from 'sdk/transactionsBuilders/buyNewSale/BuyNewSaleTransaction';
import style from './index.module.scss';

const NewSale = () => {

    const { id } = useParams();
    if (!id) throw new Error('Missing ID');

    const { data: newSaleInfo } = useGetNewSaleInfo(id);


    return <>
        <MobileHeader title={'New Sale ' + (newSaleInfo?.item.displayName ?? '')} type='light' />

        <ItemPageLayout
            itemData={newSaleInfo ? { url: newSaleInfo.item.url, displayName: newSaleInfo.item.displayName } : undefined} >
            {newSaleInfo ? <NewSaleContent newSaleInfo={newSaleInfo} id={id} /> : <Skeleton />}
        </ItemPageLayout >
    </>;


}

export default NewSale;

const NewSaleContent = ({
    newSaleInfo,
    id
}: {
    newSaleInfo: INewSaleData,
    id: string
}) => {

    const [cartQuantity, setCardQuantity] = useState(1);

    const price = new Price(new BigNumber(newSaleInfo.price).multipliedBy(cartQuantity), newSaleInfo.token.decimals);


    return <>

        {newSaleInfo.remainingSupply > 0 ?

            <>
                <div className="mt-2">

                    {newSaleInfo.remainingSupply} {newSaleInfo.item.displayName} remaining

                </div>
                <div className={style['buyContainer']}>
                    <NumberInput
                        value={cartQuantity}
                        onChanged={(v) => setCardQuantity(v)}
                        min={1}
                        max={5}
                    />

                    <SendTransactionButton
                        sendBtnLabel={price.toDenomination() + ' ' + newSaleInfo.token.symbol}
                        onSend={onBuy}
                        unlockTimestamp={newSaleInfo.startTimestamp}
                        className={style.button + ' ' + 'mt-2'} />
                </div>
            </>
            :
            <NoItemsAvailable />
        }
    </>

    async function onBuy() {
        const builder = new BuyNewSaleTransactionBuilder(newSalesContract, parseInt(id))
            .setTokenPayment(newSaleInfo.token.identifier)
            .setPaymentValue(new BigNumber(newSaleInfo.price).multipliedBy(cartQuantity));

        await refreshAccount();

        await sendTransactions({
            transactions: builder.build(),
            transactionDisplayInfo: {
                processingMessage: 'Processing customization transaction',
                errorMessage: 'An error has occured during customization',
                successMessage: 'Customization transaction successful'
            },
            redirectAfterSign: false
        });
    }
}

const NoItemsAvailable = () => {

    return <div className={style['buyContainer']}>
        <p>Sorry, there are no more items available</p>
    </div>

};