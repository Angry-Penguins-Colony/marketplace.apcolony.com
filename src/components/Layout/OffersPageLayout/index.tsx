import React from 'react';
import { IMarketData } from '@apcolony/marketplace-api';
import UnderlineNavElmt from 'components/Abstract/UnderlineNavElmt/UnderlineNavElmt';
import SearchIcon from 'components/Icons/SearchIcon';
import MarketData from 'components/Inventory/MarketData';
import CategoriesType from 'sdk/types/CategoriesType';
import MobileHeader from '../MobileHeader/MobileHeader';
import style from './index.module.scss';

interface IProps {
    icon: string;
    marketData?: IMarketData;
    children?: React.ReactNode;
    pageStyle: CategoriesType;
    pageTitle: string;
}

const OffersPageLayout = ({
    icon,
    marketData,
    children,
    pageStyle,
    pageTitle
}: IProps) => {


    const iconClassName = pageStyle == 'penguins' ? (' ' + style.penguins) : '';
    const backgroundHeaderClassName = style[pageStyle];

    return (
        <div className={style['type-in-marketplace']}>
            <MobileHeader title={'Marketplace'} rightIcon={<SearchIcon />} type='light' />
            <div className={style['background-header'] + ' ' + backgroundHeaderClassName} />
            <div className={style.icon + ' ' + iconClassName}>
                <img src={icon} alt={pageStyle} />
            </div>
            <h1>{pageTitle}</h1>
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
                {children}
            </div>
        </div >
    );
};

export default OffersPageLayout;