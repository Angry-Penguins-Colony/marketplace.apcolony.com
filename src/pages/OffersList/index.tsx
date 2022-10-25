import * as React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { Link, useParams } from 'react-router-dom';
import PenguinIcon from 'assets/img/icons/penguin-icon.jpg';
import UnderlineNavElmt from 'components/Abstract/UnderlineNavElmt/UnderlineNavElmt';
import ErrorPage from 'components/ErrorPage';
import SearchIcon from 'components/Icons/SearchIcon';
import { Item } from 'components/Inventory/Item/Item';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import { buildRouteLinks } from 'routes';
import useGetMarketData from 'sdk/hooks/api/useGetMarketData';
import useGetOffersOfCategory from 'sdk/hooks/api/useGetOffersOfCategory';
import { isSlot } from 'sdk/misc/guards';
import CategoriesType from 'sdk/types/CategoriesType';
import MarketData from '../../components/Inventory/MarketData';
import defaultPenguinImg from './../../assets/img/penguin_default.png';
import style from './index.module.scss';

interface IProps {
    category: CategoriesType
}

const OffersList = ({
    category
}: IProps) => {
    const { slot } = useParams();

    const title = slot ?? category;
    const { data: offersReponses } = useGetOffersOfCategory(slot ?? category);
    const { data: marketData } = useGetMarketData(slot ?? category);


    const [offers, setOffers] = React.useState<IItem[] | undefined>(undefined);

    React.useEffect(() => {

        console.log(offersReponses);

        if (offersReponses) {
            setOffers(offersReponses.associatedItems as IItem[]);
        }
    }, [offersReponses]);

    const icon = category == 'penguins' ?
        PenguinIcon
        : `/img/icon/${slot}_unicolor_icon.svg`;


    return (
        <div className={style['type-in-marketplace']}>
            <MobileHeader title={'Marketplace'} rightIcon={<SearchIcon />} type='light' />
            <div className={style['background-header'] + ' ' + style[category]} />
            <div className={style.icon + (category == 'penguins' ? (' ' + style.penguins) : '')}>
                <img src={icon} alt={category} />
            </div>
            <h1>{title}</h1>
            {
                marketData &&
                <MarketData
                    floorPrice={parseInt(marketData.floorPrice)}
                    totalVolume={parseInt(marketData.totalVolume)}
                    averagePrice={parseInt(marketData.averagePrice)}
                    totalListed={marketData.totalListed}
                />
            }
            <p className={style.description}></p>
            <div className={style.labels}>
                <UnderlineNavElmt name={'Offers'} isActive={true} />
            </div>
            {/* TODO: add filters */}
            <div className={style.items}>
                {getItems()}
            </div>
        </div >
    );

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