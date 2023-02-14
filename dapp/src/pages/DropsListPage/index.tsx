import React from 'react';
import { IDropData } from '@apcolony/marketplace-api';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import { ResponsiveElementThumbnail } from 'components/ResponsiveElementThumbnail';
import Price from 'sdk/classes/Price';
import useGetAllDrops from 'sdk/hooks/api/useGetAllDrops';
import style from './index.module.scss'

export const DropsListPage = () => {
    const {
        currentDrops,
        soldoutDrops
    } = useGetAllDrops();

    return <>
        <MobileHeader title={'Drops List'} type='light' />

        <div className={style.content}>

            <h1>Special drops !</h1>

            <DropsList drops={currentDrops} />

            {soldoutDrops && soldoutDrops.length > 0 &&

                <>
                    <h1>Over drops</h1>

                    <DropsList drops={soldoutDrops} />
                </>
            }
        </div>
    </>;
}

const DropsList = ({ drops }: { drops: IDropData[] | undefined }) => {

    const LOADING_ELEMENTS = 2;

    return <div className={style.items}>
        {drops ?
            drops.map((drop, index) => {

                const subProperty = new Price(drop.price, drop.token.decimals).toDenomination() + ' ' + drop.token.symbol + ' (' + drop.remainingSupply + '/' + drop.maxSupply + ')';

                return <ResponsiveElementThumbnail
                    key={drop.id}
                    element={drop.item}
                    subProperty={subProperty}
                />
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