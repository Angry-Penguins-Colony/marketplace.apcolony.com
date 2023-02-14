import React from 'react';
import { IDropData } from '@apcolony/marketplace-api';
import { Link, Outlet } from 'react-router-dom';
import PageIcon from 'assets/img/Gift-alone.png';
import OffersPageLayout from 'components/Layout/OffersPageLayout';
import { ResponsiveElementThumbnail } from 'components/ResponsiveElementThumbnail';
import { buildRouteLinks } from 'routes';
import Price from 'sdk/classes/Price';
import useGetAllDrops from 'sdk/hooks/api/useGetAllDrops';
import style from './index.module.scss'

export const DropsListPage = () => {
    return <OffersPageLayout
        pageTitle='New drops'
        pageStyle='items'
        iconClassName='bg-transparent'
        icon={PageIcon}
        tabs={[
            {
                name: 'Current',
                path: 'current'
            },
            {
                name: 'Closed',
                path: 'closed'
            }
        ]} >
        <Outlet />
    </OffersPageLayout >;
}

export const CurrentDropsList = () => {
    const {
        currentDrops
    } = useGetAllDrops();

    if (!currentDrops || currentDrops.length > 0) {
        return <DropsList drops={currentDrops} />
    }
    else {
        return <div className={style.noCurrentDropsInfo}>
            No current drops.
        </div>
    }
}

export const ClosedDropsList = () => {
    const {
        soldoutDrops
    } = useGetAllDrops();

    return <DropsList drops={soldoutDrops} showSubProperty={false} />
}

const DropsList = ({ drops, showSubProperty = true }: { drops: IDropData[] | undefined, showSubProperty?: boolean }) => {

    const LOADING_ELEMENTS = 2;

    return <div className={style.items}>
        {drops ?
            drops.map((drop) => {

                const subProperty = new Price(drop.price, drop.token.decimals).toDenomination() + ' ' + drop.token.symbol + ' (' + drop.remainingSupply + '/' + drop.maxSupply + ')';

                return <Link to={buildRouteLinks.dropPage(drop.id)}>
                    <ResponsiveElementThumbnail
                        key={drop.id}
                        element={drop.item}
                        subProperty={showSubProperty ? subProperty : ''}
                    />
                </Link>;
            })
            :
            Array(LOADING_ELEMENTS).map((drop, index) => {
                return <ResponsiveElementThumbnail
                    key={index}
                />
            })
        }
    </div>
}