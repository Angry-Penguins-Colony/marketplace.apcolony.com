import React, { useState } from 'react';
import { IDropData } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import { refreshAccount } from '@elrondnetwork/dapp-core/utils';
import BigNumber from 'bignumber.js';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import NumberInput from 'components/Buttons/NumberInput';
import SendTransactionButton from 'components/Buttons/SendTransactionButton';
import ItemPageLayout from 'components/Layout/ItemPageLayout';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import { dropsContract, stakeTokenName } from 'config';
import Price from 'sdk/classes/Price';
import useGetDropData from 'sdk/hooks/api/useGetDropData';
import { useGetGenericItem } from 'sdk/hooks/api/useGetGenericItem';
import useGetBalance from 'sdk/hooks/useGetBalance';
import useGetOnTransactionSuccesful from 'sdk/hooks/useGetOnTransactionSuccesful';
import BuyDropTransactionBuilder from 'sdk/transactionsBuilders/buyDrop/BuyDropTransactionBuilder';
import style from './index.module.scss';

const DropPage = () => {

    const { id } = useParams();
    if (!id) throw new Error('Missing ID');

    const { data: dropData, forceReload } = useGetDropData(id);

    useGetOnTransactionSuccesful(forceReload);

    return <>
        <MobileHeader title={'New Sale ' + (dropData?.item.displayName ?? '')} type='light' />

        <ItemPageLayout
            itemData={dropData ? { url: dropData.item.thumbnailUrls.high, displayName: dropData.item.displayName } : undefined}
            subProperties={dropData ? `${dropData.item.stakePoints} ${stakeTokenName}` : ''}
        >
            {dropData ? <DropPageContent dropData={dropData} auctionId={id} /> : <Skeleton />}
        </ItemPageLayout >
    </>;


}

export default DropPage;

const DropPageContent = ({
    dropData,
    auctionId
}: {
    dropData: IDropData,
    auctionId: string
}) => {

    const { address } = useGetAccountInfo();
    const { balance, forceUpdate: forceReloadBalance } = useGetBalance(dropData.token.identifier)

    const { data: item, forceReload: forceReloadItem } = useGetGenericItem('items', dropData.item.id);

    const MAX_CART_SIZE = 9999;
    const [cartQuantity, setCardQuantity] = useState(1);

    const price = new Price(new BigNumber(dropData.price).multipliedBy(cartQuantity), dropData.token.decimals);

    React.useEffect(() => { forceReload(); }, [dropData]);

    function forceReload() {
        forceReloadItem();
        forceReloadBalance();
    }

    return <>

        {dropData.remainingSupply > 0 ?

            <>


                <div className={style['buyContainer']}>

                    <h1 className={style.dropRemainingProgression}>{dropData.remainingSupply} / {dropData.maxSupply}</h1>

                    <NumberInput
                        value={cartQuantity}
                        onChanged={(v) => setCardQuantity(v)}
                        min={1}
                        max={getCardMaxSize()}
                    />

                    <SendTransactionButton
                        sendBtnLabel={price.toDenomination() + ' ' + dropData.token.symbol}
                        onSend={onBuy}
                        unlockTimestamp={dropData.startTimestamp}
                        className={style.button + ' ' + 'mt-2'}
                        disabled={getCardMaxSize() == 0} />

                    {(item && address) &&
                        <>
                            <p className="mt-2 text-muted" >
                                You have {item?.ownedAmount ?? '0'} {item?.displayName}
                            </p>
                            {balance != undefined &&
                                <>
                                    <hr />
                                    <p className="text-muted">
                                        You have {new Price(balance.amount, balance.decimals).toDenomination(2)} {dropData.token.symbol}
                                    </p>
                                </>
                            }
                        </>
                    }


                </div>
            </>
            :
            <NoItemsAvailable />
        }
    </>

    function getCardMaxSize() {
        const maxBuyableWithBalance = balance ? new BigNumber(balance.amount).dividedBy(dropData.price).toNumber() : 999999;

        return Math.min(MAX_CART_SIZE, dropData.remainingSupply, maxBuyableWithBalance);
    }

    async function onBuy() {
        const builder = new BuyDropTransactionBuilder(dropsContract, parseInt(auctionId))
            .setTokenPayment(dropData.token.identifier)
            .setPaymentValue(new BigNumber(dropData.price).multipliedBy(cartQuantity));

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