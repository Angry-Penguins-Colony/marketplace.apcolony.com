import React from 'react';
import BigNumber from 'bignumber.js';
import { capitalize } from 'lodash';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ResponsiveElementThumbnail } from 'components/ResponsiveElementThumbnail';
import { buildRouteLinks } from 'routes';
import useGetOffersOfCategory from 'sdk/hooks/api/useGetOffersOfCategory';
import CategoriesType from 'sdk/types/CategoriesType';
import style from './index.module.scss';


interface IProps {
    category: CategoriesType;
    slot?: string;
}

export const OffersList = ({
    category,
    slot
}: IProps) => {

    const { data: offers } = useGetOffersOfCategory(category, slot);

    return (
        <>
            <Helmet>
                <title>Buy {capitalize(category)}</title>
            </Helmet>

            <div className={style.items}>
                {getItems()}
            </div>
        </>
    );

    function getItems() {

        if (!category) throw new Error('Missing category');

        if (offers) {
            if (offers.associatedItems.length == 0) {
                return <div>No offers yet.</div>
            }
            else {
                return offers.associatedItems
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

}