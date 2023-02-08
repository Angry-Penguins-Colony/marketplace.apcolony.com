import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import BuyPriceContainer from 'components/Abstract/BuyPriceContainer';
import ItemPageLayout from 'components/Layout/ItemPageLayout';
import Price from 'sdk/classes/Price';
import useGetNewSaleInfo from 'sdk/hooks/api/useGetNewSaleInfo';

const NewSale = () => {

    const { id } = useParams();
    if (!id) throw new Error('Missing ID');

    const { data: newSaleInfo } = useGetNewSaleInfo(id);

    return <ItemPageLayout
        itemData={newSaleInfo ? { url: newSaleInfo.item.url, displayName: newSaleInfo.item.displayName } : undefined} >


        {newSaleInfo ?
            <BuyPriceContainer
                buyableOffersCount={newSaleInfo.remainingSupply}
                offersCount={newSaleInfo.remainingSupply}
                showOffersCount={false}
                price={new Price(newSaleInfo.price, newSaleInfo.token.decimals)}
                tokenSymbol={newSaleInfo.token.symbol}
                onBuy={onBuy}
                showTitle={false}
                unlockTimestamp={newSaleInfo.startTimestamp}
            >
                <div className="mt-2">
                    {newSaleInfo.remainingSupply} {newSaleInfo.item.displayName} remaining
                </div>
            </BuyPriceContainer>
            :
            <Skeleton />
        }

    </ItemPageLayout >;

    function onBuy() {
        console.warn('OnBuy no implemented yet');
    }
}

export default NewSale;

