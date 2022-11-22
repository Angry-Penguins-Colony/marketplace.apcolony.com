import * as React from 'react';
import { ElementType } from '@apcolony/marketplace-api';
import BigNumber from 'bignumber.js';
import { Link, useParams } from 'react-router-dom';
import EggsIcon from 'assets/img/icons/eggs-icon.png';
import PenguinIcon from 'assets/img/icons/penguin-icon.jpg';
import ErrorPage from 'components/ErrorPage';
import { HorizontalItem } from 'components/Inventory/HorizontalItem';
import OffersPageLayout from 'components/Layout/OffersPageLayout';
import { icons } from 'icons';
import { buildRouteLinks } from 'routes';
import useGetMarketData from 'sdk/hooks/api/useGetMarketData';
import useGetOffersOfCategory from 'sdk/hooks/api/useGetOffersOfCategory';
import { isSlot } from 'sdk/misc/guards';
import style from './index.module.scss';

interface IProps {
    category: ElementType
}

const OffersList = ({
    category
}: IProps) => {
    const { slot } = useParams();

    const { data: offers } = useGetOffersOfCategory(category, slot);
    const { data: marketData } = useGetMarketData(category, slot);

    return <OffersPageLayout
        icon={getIcon()}
        marketData={marketData}
        pageStyle={category}
        pageTitle={slot ?? category}
        iconNoBorder={slot == undefined}
    >
        <div className={style.items}>
            {getItems()}
        </div>
    </OffersPageLayout>

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

    function getIcon() {
        switch (category) {
            case 'penguins':
                return PenguinIcon;

            case 'items':
                return icons[slot as any].unicolor;

            case 'eggs':
                return EggsIcon;

            default:
                console.warn('Unknown category', category);
                return undefined;
        }
    }
};

const ErrorWrapper = (props: IProps) => {
    const { slot } = useParams();

    if (slot && isSlot(slot) == false) {
        return <ErrorPage
            title="Invalid slot"
            description="The slot you are looking for does not exist."
        />
    }
    else {
        return <OffersList {...props} />
    }
}

export default ErrorWrapper;

