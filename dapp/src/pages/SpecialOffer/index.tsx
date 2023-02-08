import React from 'react';
import ItemPageLayout from 'components/Layout/ItemPageLayout';

const SpecialOfferPage = () => {

    return <ItemPageLayout
        itemData={{
            url: 'https://apc-items.s3.eu-west-3.amazonaws.com/thumbnail_web/15-thumbnail-web.jpg',
            displayName: 'Chewing Gum'
        }}>

    </ItemPageLayout >
}

export default SpecialOfferPage;