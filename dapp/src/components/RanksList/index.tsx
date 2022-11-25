import React from 'react';
import { ElementType } from '@apcolony/marketplace-api';
import ReactPaginate from 'react-paginate';
import { Link, useSearchParams } from 'react-router-dom';
import { ResponsiveElementThumbnail } from 'components/ResponsiveElementThumbnail';
import { penguinsCount } from 'config';
import { buildRouteLinks } from 'routes';
import { useGetRanks } from 'sdk/hooks/api/useGetRanks';
import style from './index.module.scss';

interface Props {
    category: ElementType;
}

export const RanksList = ({ category }: Props) => {

    const PAGE_SIZE = 20;
    const [page, setPage] = useGetPage();

    const ranks = useGetRanks(category, (page - 1) * PAGE_SIZE, PAGE_SIZE);

    const pagination = <ReactPaginate
        breakLabel="..."
        previousLabel="<"
        nextLabel=">"
        initialPage={page - 1}
        onPageChange={handlePageChange}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={Math.ceil(penguinsCount / PAGE_SIZE)}

        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
    />;



    if (ranks.data == undefined) {

        return wrapItems(
            Array.from({ length: 10 }, (_, i) => <ResponsiveElementThumbnail key={i} />)
        );
    }
    else {
        return wrapItems(
            <div className={style.items}>
                {
                    ranks.data.map(element =>
                        <Link to={buildRouteLinks.inspect(category, element.id)} key={element.id}>
                            <ResponsiveElementThumbnail
                                key={element.rank}
                                element={element}
                                subProperty={'Rank ' + element.rank} />
                        </Link>)
                }
            </div>
        );
    }

    function handlePageChange(selectedItem: { selected: number }) {
        const { selected } = selectedItem;
        const newPage = selected + 1;
        setPage(newPage);
    }

    function wrapItems(items: React.ReactNode) {
        return <div className={style.content}>
            <div className="d-flex justify-content-center">
                {pagination}
            </div>

            <div className={style.items}>
                {items}
            </div>

            <div className="d-flex justify-content-center">
                {pagination}
            </div>
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