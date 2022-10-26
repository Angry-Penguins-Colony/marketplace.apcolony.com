import * as React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { Link, useParams } from 'react-router-dom';
import PenguinIcon from 'assets/img/icons/penguin-icon.jpg';
import ErrorPage from 'components/ErrorPage';
import { Item } from 'components/Inventory/Item/Item';
import OffersPageLayout from 'components/Layout/OffersPageLayout';
import { icons } from 'icons';
import { buildRouteLinks } from 'routes';
import useGetMarketData from 'sdk/hooks/api/useGetMarketData';
import useGetOffersOfCategory from 'sdk/hooks/api/useGetOffersOfCategory';
import { isSlot } from 'sdk/misc/guards';
import CategoriesType from 'sdk/types/CategoriesType';
import defaultPenguinImg from './../../assets/img/penguin_default.png';
import style from './index.module.scss';

interface IProps {
    category: CategoriesType
}

const OffersList = ({
    category
}: IProps) => {
    const { slot } = useParams();

    const { data: offersReponses } = useGetOffersOfCategory(slot ?? category);
    const { data: marketData } = useGetMarketData(slot ?? category);


    const [offers, setOffers] = React.useState<IItem[] | undefined>(undefined);

    React.useEffect(() => {
        if (offersReponses) {
            setOffers(offersReponses.associatedItems as IItem[]);
        }
    }, [offersReponses]);

    const icon = category == 'penguins' ? PenguinIcon : icons[slot as any].unicolor;

    return <OffersPageLayout
        icon={icon}
        marketData={marketData}
        pageStyle={category}
        pageTitle={slot ?? category}
    >
        <div className={style.items}>
            {getItems()}
        </div>
    </OffersPageLayout>

    function getItems() {

        if (!category) throw new Error('Missing category');

        if (offers) {
            if (offers.length == 0) {
                return <div>No offers yet.</div>
            }
            else {
                return offers.map(variant => {
                    const link = buildRouteLinks.inspect((category == 'penguins' ? 'penguins' : 'items'), variant.id)

                    return (
                        <>
                            <Link className={style.itemRoot} to={link} key={variant.id}>
                                <Item item={variant} displayId={false} className={style.mobile} />

                                <div className={style.desktop}>
                                    <img src={defaultPenguinImg} alt="default background of any penguin" className={style.background} />
                                    <img src={variant.thumbnailUrls.high} alt="" className={style.item} />
                                    <div className={style.infos}>
                                        <div className={style.name}>{variant.name}</div>
                                    </div>
                                </div>
                            </Link>
                        </>
                    );
                })
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

