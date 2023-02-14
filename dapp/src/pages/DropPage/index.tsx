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
import { useGetGenericItem } from 'sdk/hooks/api/useGetGenericItem';
import useGetNewSaleInfo from 'sdk/hooks/api/useGetNewSaleInfo';
import useGetOnTransactionSuccesful from 'sdk/hooks/useGetOnTransactionSuccesful';
import BuyNewSaleTransactionBuilder from 'sdk/transactionsBuilders/buyNewSale/BuyNewSaleTransaction';
import style from './index.module.scss';

const DropPage = () => {

    const { id } = useParams();
    if (!id) throw new Error('Missing ID');

    const { data: newSaleInfo, forceReload } = useGetNewSaleInfo(id);

    useGetOnTransactionSuccesful(forceReload);

    return <>
        <MobileHeader title={'New Sale ' + (newSaleInfo?.item.displayName ?? '')} type='light' />

        <ItemPageLayout
            itemData={newSaleInfo ? { url: newSaleInfo.item.thumbnailUrls.high, displayName: newSaleInfo.item.displayName } : undefined} >
            {newSaleInfo ? <DropPageContent newSaleInfo={newSaleInfo} auctionId={id} /> : <Skeleton />}
        </ItemPageLayout >
    </>;


}

export default DropPage;

const DropPageContent = ({
    newSaleInfo,
    auctionId
}: {
    newSaleInfo: INewSaleData,
    auctionId: string
}) => {

    const { data: item, forceReload } = useGetGenericItem('items', newSaleInfo.item.id);

    const MAX_BUYABLE_DEFAULT = 5;
    const [cartQuantity, setCardQuantity] = useState(1);

    const price = new Price(new BigNumber(newSaleInfo.price).multipliedBy(cartQuantity), newSaleInfo.token.decimals);

    React.useEffect(() => { forceReload() }, [newSaleInfo]);

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
                        max={getMaxBuyable()}
                    />

                    <SendTransactionButton
                        sendBtnLabel={price.toDenomination() + ' ' + newSaleInfo.token.symbol}
                        onSend={onBuy}
                        unlockTimestamp={newSaleInfo.startTimestamp}
                        className={style.button + ' ' + 'mt-2'} />

                    {item &&
                        <p className="mt-2 text-muted" >
                            You have {item?.ownedAmount ?? '0'} {item?.displayName}
                        </p>
                    }
                </div>
            </>
            :
            <NoItemsAvailable />
        }
    </>

    function getMaxBuyable() {
        return Math.min(MAX_BUYABLE_DEFAULT, newSaleInfo.remainingSupply);
    }

    async function onBuy() {
        const builder = new BuyNewSaleTransactionBuilder(newSalesContract, parseInt(auctionId))
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