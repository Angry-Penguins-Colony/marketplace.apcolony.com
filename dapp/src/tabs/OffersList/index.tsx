import React from 'react';
import { IItem, IPenguin, Slot, slotToPlural } from '@apcolony/marketplace-api';
import BigNumber from 'bignumber.js';
import { capitalize } from 'lodash';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { ResponsiveElementThumbnail } from 'components/ResponsiveElementThumbnail';
import { buildRouteLinks } from 'routes';
import useGetOffersOfCategory from 'sdk/hooks/api/useGetOffersOfCategory';
import CategoriesType from 'sdk/types/CategoriesType';
import { ItemsFiltersPopup } from 'systems/filters/popup/ItemsFiltersPopup';
import { PenguinsFiltersPopup } from 'systems/filters/popup/PenguinsFiltersPopup';
import style from './index.module.scss';


interface IProps {
    category: CategoriesType;
    showFilter?: boolean;
}

export const OffersList = ({
    category,
    showFilter = false
}: IProps) => {

    const { slot } = useParams();
    const { data: offers } = useGetOffersOfCategory(category, slot);

    const [visibleItems, setVisibleItems] = React.useState(offers?.associatedItems);


    React.useEffect(() => {
        setVisibleItems(offers?.associatedItems || []);
    }, [offers]);

    return (
        <>
            <Helmet>
                <title>{capitalize(slot ? slotToPlural(slot as Slot) : category)} offers</title>
            </Helmet>

            {showFilter && getFilterElement()}

            <div className={style.items}>
                {getItems()}
            </div>
        </>
    );

    function getItems() {

        if (!category) throw new Error('Missing category');

        if (offers && visibleItems) {
            if (visibleItems.length == 0) {
                return <div>No offers yet.</div>
            }
            else {
                return visibleItems
                    .map(item => {

                        const lowestOffer = offers.offers
                            .filter(offer => offer.collection == item.collection && offer.nonce == item.nonce)
                            .sort((a, b) => new BigNumber(a.price).isGreaterThan((new BigNumber(b.price))) ? 1 : -1)[0];

                        const price = lowestOffer.price;


                        const link = buildRouteLinks.inspect(category, item.id)


                        const component = <Link to={link} key={item.id}>
                            <ResponsiveElementThumbnail
                                element={item}
                                subProperty={price + ' EGLD'} />
                        </Link>;

                        return {
                            component,
                            price
                        };
                    })
                    .sort((a, b) => new BigNumber(a.price).isGreaterThan((new BigNumber(b.price))) ? 1 : -1)
                    .map(item => item.component);
            }
        }
        else {
            return Array.from({ length: 10 }).map((_, i) => <ResponsiveElementThumbnail key={i} />);
        }
    }

    function getFilterElement(): JSX.Element {
        switch (category) {
            case 'eggs':
                throw new Error('Not implemented');

            case 'penguins':
                return <PenguinsFiltersPopup
                    penguins={offers?.associatedItems as IPenguin[]}
                    onFilterChanged={setVisibleItems}
                />

            case 'items':
                return <ItemsFiltersPopup
                    items={offers?.associatedItems as IItem[] || []}

                    onFilterChanged={(filteredItems) => setVisibleItems(filteredItems)}
                />
        }
    }
}