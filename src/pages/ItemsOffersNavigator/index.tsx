import React from 'react';
import ItemsIcon from 'assets/img/icons/items-icon.jpg';
import OffersPageLayout from 'components/Layout/OffersPageLayout';

const ItemsOffersNavigator = () => {
    return <OffersPageLayout
        icon={ItemsIcon}
        iconClassName="p-0"
        pageStyle='items'
        pageTitle='Items'
    />
};

export default ItemsOffersNavigator;