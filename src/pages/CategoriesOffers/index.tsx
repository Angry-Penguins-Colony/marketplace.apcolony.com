import * as React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { Link, useParams } from 'react-router-dom';
import UnderlineNavElmt from 'components/Abstract/UnderlineNavElmt/UnderlineNavElmt';
import ErrorPage from 'components/ErrorPage';
import SearchIcon from 'components/Icons/SearchIcon';
import { Item } from 'components/Inventory/Item/Item';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import { ipfsGateway } from 'config';
import { buildRouteLinks } from 'routes';
import useGetMarketData from 'sdk/hooks/api/useGetMarketData';
import useGetOffersOfCategory from 'sdk/hooks/api/useGetOffersOfCategory';
import { isOfferCategoryValid } from 'sdk/misc/guards';
import MarketData from '../../components/Inventory/MarketData';
import defaultPenguinImg from './../../assets/img/penguin_default.png';
import style from './index.module.scss';
import PenguinIcon from './penguin-icon.jpg';

// TODO: for penguin
const CategoriesOffers = () => {
    const { category } = useParams();

    if (!category) throw new Error('Missing category');

    const title = category;
    const { data: offersReponses } = useGetOffersOfCategory(category);
    const { data: marketData } = useGetMarketData(category);


    const [offers, setOffers] = React.useState<IItem[] | undefined>(undefined);

    React.useEffect(() => {

        console.log(offersReponses);

        if (offersReponses) {
            setOffers(offersReponses.associatedItems as IItem[]);
        }
    }, [offersReponses]);


    return (
        <div className={style['type-in-marketplace']}>
            <MobileHeader title={'Marketplace'} rightIcon={<SearchIcon />} type='light' />
            <div className={style['background-header']} style={
                {
                    backgroundImage: 'url(/img/background/header_' + category + '.png)'
                }
            }></div>
            <div className={style.icon + (category == 'penguins' ? (' ' + style.penguins) : '')}>
                <img src={category == 'penguins' ? PenguinIcon : '/img/icon/' + category + '_unicolor_icon.svg'} alt={category} />
            </div>
            <h1>{title}</h1>
            {marketData &&
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
                                    <img src={ipfsGateway + variant.thumbnailCID} alt="" className={style.item} />
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

const ErrorWrapper = () => {
    const { category } = useParams();

    if (!category) throw new Error('Missing category');

    if (isOfferCategoryValid(category) == false) {
        return <ErrorPage
            title="Invalid category"
            description="The category you are looking for does not exist."
        />
    }
    else {
        return <CategoriesOffers />
    }
}

export default ErrorWrapper;