import React from 'react';
import { IDropData } from '@apcolony/marketplace-api';
import { Link } from 'react-router-dom';
import PageIcon from 'assets/img/Gift-alone.png';
import OffersPageLayout from 'components/Layout/OffersPageLayout';
import { ResponsiveElementThumbnail } from 'components/ResponsiveElementThumbnail';
import { buildRouteLinks } from 'routes';
import Price from 'sdk/classes/Price';
import useGetAllDrops from 'sdk/hooks/api/useGetAllDrops';
import style from './index.module.scss'

export const DropsListPage = () => {
    const {
        currentDrops,
        soldoutDrops
    } = useGetAllDrops();

    return <OffersPageLayout
        pageTitle='New drops'
        pageStyle='items'
        iconClassName='bg-transparent'
        icon={PageIcon}
    >
        <div className={style.content}>
            {
                !currentDrops || currentDrops.length > 0 ?
                    <DropsList drops={currentDrops} />
                    :
                    <div className={style.noCurrentDropsInfo}>
                        No current drops.
                    </div>
            }

            {soldoutDrops && soldoutDrops.length > 0 &&

                <>
                    <hr />
                    <h3>Over drops</h3>

                    <DropsList drops={soldoutDrops} />
                </>
            }
        </div>
    </OffersPageLayout>;
}

const DropsList = ({ drops }: { drops: IDropData[] | undefined }) => {

    const LOADING_ELEMENTS = 2;

    return <div className={style.items}>
        {drops ?
            drops.map((drop) => {

                const subProperty = new Price(drop.price, drop.token.decimals).toDenomination() + ' ' + drop.token.symbol + ' (' + drop.remainingSupply + '/' + drop.maxSupply + ')';

                return <Link to={buildRouteLinks.dropPage(drop.id)}>
                    <ResponsiveElementThumbnail
                        key={drop.id}
                        element={drop.item}
                        subProperty={subProperty}
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