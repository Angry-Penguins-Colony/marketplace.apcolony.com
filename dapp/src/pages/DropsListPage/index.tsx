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

    if (!soldoutDrops || soldoutDrops.length > 0) {
        return <DropsList drops={soldoutDrops} showSupplyProgression={false} />
    }
    else {
        return <div className={style.noCurrentDropsInfo}>
            No closed drops.
        </div>
    }
}

const DropsList = ({ drops, showSupplyProgression = true }: { drops: IDropData[] | undefined, showSupplyProgression?: boolean }) => {

    const LOADING_ELEMENTS = 2;

    return <div className={style.items}>
        {drops ?
            drops.map((drop) => {

                let subProperty = new Price(drop.price, drop.token.decimals).toDenomination() + ' ' + drop.token.symbol;

                if (showSupplyProgression) {
                    subProperty += ' (' + drop.remainingSupply + '/' + drop.maxSupply + ')';
                }

                return <Link to={buildRouteLinks.dropPage(drop.id)} key={drop.id}>
                    <ResponsiveElementThumbnail
                        element={drop.item}
                        subProperty={subProperty}
                    />
                </Link>;
            })
            :
            Array.from({ length: LOADING_ELEMENTS }).map((drop, index) => {
                return <ResponsiveElementThumbnail
                    key={index}
                />
            })
        }
    </div>
}