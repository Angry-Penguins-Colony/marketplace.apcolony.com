import React from 'react';
import { IItem, Slot, slotToPlural } from '@apcolony/marketplace-api';
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import Button from 'components/Abstract/Button/Button';
import { ItemsFiltersPopup } from 'components/Foreground/Popup/ItemsFiltersPopup';
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
    const [visibleItems, setVisibleItems] = React.useState(items);
    const [filterOpen, setFilterOpen] = React.useState(false);

    console.log(visibleItems)

    return <>
        <Helmet>
            <title>All {slotToPlural(slot as Slot)} items</title>
        </Helmet>

        <ItemsFiltersPopup
            items={items}
            isVisible={filterOpen}
            onCloseClicked={() => setFilterOpen(false)}
            onFilterChanged={(filteredItems) => {
                console.log('esti');
                setVisibleItems(filteredItems)
            }}
        />



        <Button className="mb-3" onClick={() => setFilterOpen(true)}>
            <FontAwesomeIcon icon={faFilter} />
            <span className='ml-2'>
                Filters
            </span>
        </Button>

        <div className={style.items}>
            {
                visibleItems
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
    return itemsDatabase.getItemsOfSlot(slot)
        .sort((a, b) => a.stakePoints - b.stakePoints);
}