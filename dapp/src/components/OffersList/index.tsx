import React from 'react';
import BigNumber from 'bignumber.js';
import { Link } from 'react-router-dom';
import { HorizontalItem } from 'components/Inventory/HorizontalItem';
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
        <div className={style.items}>
            {getItems()}
        </div>);

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

                        const component = <Link className={style.itemRoot} to={link} key={item.id}>
                            <HorizontalItem item={item} subProperty={price + ' EGLD'} className={style.mobile} />

                            <div className={style.desktop}>
                                <img loading="lazy" src={item.thumbnailUrls.high} alt="" className={style.item} />
                                <div className={style.infos}>
                                    <div className={style.name}>{item.displayName}</div>
                                    <div className={style.price}>
                                        {price} EGLD
                                    </div>
                                </div>
                            </div>
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
            return <div className="d-flex w-100 justify-content-center mt-2">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>;
        }
    }

}