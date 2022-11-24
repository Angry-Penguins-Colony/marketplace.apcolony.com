import React from 'react';
import { Outlet } from 'react-router-dom';
import PenguinIcon from 'assets/img/icons/penguin-icon.jpg';
import OffersPageLayout from 'components/Layout/OffersPageLayout';
import useGetMarketData from 'sdk/hooks/api/useGetMarketData';

export const PenguinsOffersListPage = () => {

    const { data: marketData } = useGetMarketData('penguins');

    return <OffersPageLayout
        icon={PenguinIcon}
        marketData={marketData}
        pageStyle="penguins"
        pageTitle="penguins"
        iconNoBorder={true}
    >
        <Outlet />
    </OffersPageLayout>;
}