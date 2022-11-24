import React from 'react';
import { ElementType } from '@apcolony/marketplace-api';
import { ResponsiveElementThumbnail } from 'components/ResponsiveElementThumbnail';
import { useGetRanks } from 'sdk/hooks/api/useGetRanks';
import style from './index.module.scss';

interface Props {
    category: ElementType;
}

export const RanksList = ({ category }: Props) => {

    const ranks = useGetRanks(category);

    if (ranks.data == undefined) {
        return <div className="d-flex w-100 justify-content-center mt-2">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>;
    }
    else {
        return <div className={style.items}>
            {ranks.data.map(rank => <ResponsiveElementThumbnail key={rank.rank} element={rank} subProperty={rank.rank} />)}
        </div>;
    }
}