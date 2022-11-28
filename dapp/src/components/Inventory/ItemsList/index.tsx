import React from 'react';
import { IItem } from '@apcolony/marketplace-api';
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

    return <div className={style.items}>
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

};

function useGetItems(slot: string): IItem[] {
    return itemsDatabase.getItemsOfSlot(slot);
}