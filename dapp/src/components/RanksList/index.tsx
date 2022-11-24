import React from 'react';
import { ElementType } from '@apcolony/marketplace-api';
import { Link, useSearchParams } from 'react-router-dom';
import { ResponsiveElementThumbnail } from 'components/ResponsiveElementThumbnail';
import { buildRouteLinks } from 'routes';
import { useGetRanks } from 'sdk/hooks/api/useGetRanks';
import style from './index.module.scss';

interface Props {
    category: ElementType;
}

export const RanksList = ({ category }: Props) => {

    const PAGE_SIZE = 30;
    const [page] = useGetPage();

    const ranks = useGetRanks(category, (page - 1) * PAGE_SIZE, PAGE_SIZE);

    if (ranks.data == undefined) {
        return <div className="d-flex w-100 justify-content-center mt-2">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>;
    }
    else {
        return <div className={style.items}>
            {
                ranks.data.map(element =>
                    <Link to={buildRouteLinks.inspect(category, element.id)} key={element.id}>
                        <ResponsiveElementThumbnail
                            key={element.rank}
                            element={element}
                            subProperty={'Rank ' + element.rank} />
                    </Link>)
            }
        </div>;
    }
}

const useGetPage = (): [number, (p: number) => void] => {
    const [searchParams, setSearchParams] = useSearchParams();

    return [
        parseInt(searchParams.get('page') || '1'),
        (page: number) => setSearchParams({ page: page.toString() })
    ];
}