import React from 'react';
import { IMarketData } from '@apcolony/marketplace-api';
import { Link, useLocation } from 'react-router-dom';
import UnderlineNavElmt from 'components/Abstract/UnderlineNavElmt/UnderlineNavElmt';
import SearchIcon from 'components/Icons/SearchIcon';
import MarketData from 'components/Inventory/MarketData';
import CategoriesType from 'sdk/types/CategoriesType';
import MobileHeader from '../MobileHeader/MobileHeader';
import style from './index.module.scss';


interface ITab {
    name: string;
    path: string;
}

interface IProps {
    icon?: string;
    pageStyle: CategoriesType;
    pageTitle: string;
    marketData?: IMarketData;
    children?: React.ReactNode;
    iconClassName?: string;
    iconNoBorder?: boolean;
    tabs?: ITab[];
}

const OffersPageLayout = ({
    icon,
    marketData,
    children,
    pageStyle,
    pageTitle,
    iconNoBorder = false,
    iconClassName: anotherIconClassName = '',
    tabs = []
}: IProps) => {


    const activeTab = useActiveTab();

    const iconClassName = [
        style.icon,
        iconNoBorder ? (' ' + style.iconNoBorder) : '',
        anotherIconClassName
    ].join(' ');
    const backgroundHeaderClassName = style[pageStyle];

    return (
        <div className={style['type-in-marketplace']}>
            <MobileHeader title={'Marketplace'} rightIcon={<SearchIcon />} type='light' />
            <div className={style['background-header'] + ' ' + backgroundHeaderClassName} />

            <div className={iconClassName}>
                <img src={icon} alt={pageStyle} />
            </div>
            <h1>{pageTitle}</h1>
            {
                marketData &&
                <MarketData
                    floorPrice={parseFloat(marketData.floorPrice)}
                    totalVolume={parseFloat(marketData.totalVolume)}
                    averagePrice={parseFloat(marketData.averagePrice)}
                    totalListed={marketData.totalListed}
                />
            }
            <p className={style.description}></p>
            <div className={style.labels}>
                {
                    tabs.map((tab, index) => (
                        <Link to={tab.path}>
                            <UnderlineNavElmt
                                key={index}
                                name={tab.name}
                                isActive={activeTab === tab.path}
                            />
                        </Link>
                    ))
                }
            </div>
            {/* TODO: add filters */}
            <div className={style.items}>
                {children}
            </div>
        </div >
    );
};

export default OffersPageLayout;

const useActiveTab = () => {
    const location = useLocation();
    const lastRoute = location.pathname.split('/').pop();

    return lastRoute;
};