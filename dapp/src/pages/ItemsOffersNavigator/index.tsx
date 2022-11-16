import React from 'react';
import ItemsIcon from 'assets/img/icons/items-icon.jpg';
import ItemSlotCard, { IItemSlotCardProps } from 'components/ItemSlotCard';
import OffersPageLayout from 'components/Layout/OffersPageLayout';
import { slots } from 'config';
import { icons } from 'icons';
import { buildRouteLinks } from 'routes';
import style from './index.module.scss';

const ItemsOffersNavigator = () => {


    const items: IItemSlotCardProps[] = slots
        .map(slot => {
            return {
                icon: icons[slot].unicolor,
                link: buildRouteLinks.itemsOffers(slot),
                title: slot
            }
        })

    return <OffersPageLayout
        icon={ItemsIcon}
        iconClassName="p-0"
        pageStyle='items'
        pageTitle='Items'
        iconNoBorder={true}
    >
        <div className={style.itemsContainer}>
            {items.map(item => <ItemSlotCard key={item.title} className={style.item} {...item} />)}
        </div>

    </ OffersPageLayout>
};


export default ItemsOffersNavigator;