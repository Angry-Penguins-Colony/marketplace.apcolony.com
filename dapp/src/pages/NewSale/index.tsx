import React, { useState } from 'react';
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
    const [cartQuantity, setCardQuantity] = useState(1);

    const price = newSaleInfo ? new Price(new BigNumber(newSaleInfo.price).multipliedBy(cartQuantity), newSaleInfo.token.decimals) : undefined;


    return <>
        <MobileHeader title={'New Sale ' + (newSaleInfo?.item.displayName ?? '')} type='light' />

        <ItemPageLayout
            itemData={newSaleInfo ? { url: newSaleInfo.item.url, displayName: newSaleInfo.item.displayName } : undefined} >



            {newSaleInfo && price ?

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
                <Skeleton />
            }

        </ItemPageLayout >
    </>;

    async function onBuy() {
        if (!id) throw new Error('Missing ID');
        if (!newSaleInfo) throw new Error('newsaleInfo not loaded yet');


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

export default NewSale;

