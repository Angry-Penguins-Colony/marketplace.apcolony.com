import React from 'react';
import ItemsIcon from 'assets/img/icons/items-icon.jpg';
import ItemSlotCard, { IItemSlotCardProps } from 'components/ItemSlotCard';
import OffersPageLayout from 'components/Layout/OffersPageLayout';
import { slots } from 'config';
import { buildRouteLinks } from 'routes';
import { getIconOfSlot } from 'sdk/misc/shorthands';
import style from './index.module.scss';

const ItemsOffersNavigator = () => {


    const items: IItemSlotCardProps[] = slots
        .map(slot => {
            return {
                icon: getIconOfSlot(slot),
                link: buildRouteLinks.itemsOffers(slot),
                title: slot
            }
        })

    return <OffersPageLayout
        icon={ItemsIcon}
        iconClassName="p-0"
        pageStyle='items'
        pageTitle='Items'
    >
        <div className={style.itemsContainer}>
            {items.map(item => <ItemSlotCard key={item.title} className={style.item} {...item} />)}
        </div>

    </ OffersPageLayout>
};


export default ItemsOffersNavigator;