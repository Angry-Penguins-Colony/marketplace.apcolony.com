import * as React from 'react';
import { ElementType } from '@apcolony/marketplace-api';
import { Outlet, useParams } from 'react-router-dom';
import EggsIcon from 'assets/img/icons/eggs-icon.png';
import PenguinIcon from 'assets/img/icons/penguin-icon.jpg';
import ErrorPage from 'components/ErrorPage';
import OffersPageLayout from 'components/Layout/OffersPageLayout';
import { icons } from 'icons';
import useGetMarketData from 'sdk/hooks/api/useGetMarketData';
import { isSlot } from 'sdk/misc/guards';

interface IProps {
    category: ElementType
}

const GenericOfferListPage = ({
    category
}: IProps) => {
    const { slot } = useParams();


    const { data: marketData } = useGetMarketData(category, slot);

    return <OffersPageLayout
        icon={getIcon()}
        marketData={marketData}
        pageStyle={category}
        pageTitle={slot ?? category}
        iconNoBorder={slot == undefined}
        tabs={getTabs()}
    >
        <Outlet />
    </OffersPageLayout>


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

    function getTabs() {
        switch (category) {
            case 'penguins':
                throw new Error('Please use PenguinsOfferListPage instead');

            case 'items':
                return [
                    { name: 'Offers', path: 'offers' },
                    { name: 'All items', path: 'list' },
                ];

            case 'eggs':
                return [{ name: 'Offers', path: 'offers' }];

            default:
                console.warn('Unknown category', category);
                return [];
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
        return <GenericOfferListPage {...props} />
    }
}

export default ErrorWrapper;

