import React from 'react';
import { IItem, Slot, slotToPlural } from '@apcolony/marketplace-api';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { ResponsiveElementThumbnail } from 'components/ResponsiveElementThumbnail';
import { itemsDatabase } from 'config';
import { buildRouteLinks } from 'routes';
import style from './index.module.scss';

export const ItemsList = () => {

    const { slot } = useParams();

    if (slot == undefined) {
        return <div>Slot is undefined</div>;
    }

    const items = useGetItems(slot);

    return <>
        <Helmet>
            <title>All {slotToPlural(slot as Slot)} items</title>
        </Helmet>

        <div className={style.items}>
            {
                items
                    .map(element =>
                        <Link to={buildRouteLinks.inspect('items', element.id)} key={element.id}>
                            <ResponsiveElementThumbnail
                                key={element.id}
                                element={element}
                                subProperty={'#' + element.id} />
                        </Link>
                    )
            }
        </div>
    </>;

};

function useGetItems(slot: string): IItem[] {
    return itemsDatabase.getItemsOfSlot(slot);
}