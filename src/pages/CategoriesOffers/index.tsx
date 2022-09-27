import * as React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { Link, useParams } from 'react-router-dom';
import UnderlineNavElmt from 'components/Abstract/UnderlineNavElmt/UnderlineNavElmt';
import SearchIcon from 'components/Icons/SearchIcon';
import { Item } from 'components/Inventory/Item/Item';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import { ipfsGateway } from 'config';
import { buildRouteLinks } from 'routes';
import useGetOffers from 'sdk/hooks/api/useGetOffers';
import CategoriesType from 'sdk/types/CategoriesType';
import MarketData from '../../components/Inventory/MarketData';
import defaultPenguinImg from './../../assets/img/penguin_default.png';
import style from './index.module.scss';

// TODO: for penguin
const CategoriesOffers = () => {
    const { category } = useParams();

    if (!category) throw new Error('Missing category');

    const title = category;

    const offersReponses = useGetOffers(category);


    console.log(offersReponses);

    // get marketplace data by api call
    const [marketplace] = React.useState({
        floorPrice: -1,
        totalVolume: -1,
        averagePrice: -1,
        totalListed: -1,
        description: 'description is unset yet'
    });


    const [offers, setOffers] = React.useState<IItem[] | undefined>(undefined);

    React.useEffect(() => {

        console.log(offersReponses);

        if (offersReponses) {
            setOffers(offersReponses.associatedItems);
        }
    }, [offersReponses]);


    return (
        <div className={style['type-in-marketplace']}>
            <MobileHeader title={'Marketplace'} rightIcon={<SearchIcon />} type='light' />
            <div className={style['background-header']} style={
                {
                    backgroundImage: 'url(/img/background/items_header_' + category + '.png)'
                }
            }></div>
            <div className={style.icon}><img src={'/img/icon/' + category + '_unicolor_icon.svg'} alt={category} /></div>
            <h1>{title}</h1>
            <MarketData floorPrice={marketplace.floorPrice} totalVolume={marketplace.totalVolume} averagePrice={marketplace.averagePrice} totalListed={marketplace.totalListed} />
            <p className={style.description}>{marketplace.description}</p>
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
                return offers.map(variant => (
                    <>
                        <Link className={style.itemRoot} to={buildRouteLinks.inspect(category as CategoriesType, variant.id)} key={variant.id} >
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
                ))
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

export default CategoriesOffers;