import React from 'react';
import BuyPriceContainer from 'components/Abstract/BuyPriceContainer';
import ItemPageLayout from 'components/Layout/ItemPageLayout';
import Price from 'sdk/classes/Price';

const NewSale = () => {

    const {
        url,
        displayName,
        remainingSupply,
        price,
        token
    } = useGetNewSaleInfo(-1);

    return <ItemPageLayout
        itemData={{ url, displayName }} >

        <p>
            {remainingSupply} remaining
        </p>

        <BuyPriceContainer
            buyableOffersCount={remainingSupply}
            offersCount={remainingSupply}
            showOffersCount={false}
            price={price}
            tokenName={token}
            onBuy={onBuy}
            showTitle={false}
        />

    </ItemPageLayout>;

    function onBuy() {
        console.warn('OnBuy no implemented yet');
    }
}

export default NewSale;

function useGetNewSaleInfo(id: number) {
    console.log('Getting new sale id #' + id)

    return {
        url: 'https://apc-items.s3.eu-west-3.amazonaws.com/thumbnail_web/15-thumbnail-web.jpg',
        displayName: 'Chewing Gum',
        startTimestamp: -1,
        price: Price.fromEgld(1),
        token: '$ICE',
        maxSupply: 50,
        remainingSupply: 10
    }
}