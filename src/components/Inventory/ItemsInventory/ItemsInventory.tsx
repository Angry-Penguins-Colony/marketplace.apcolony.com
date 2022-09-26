import * as React from 'react';
import ReactImageAppear from 'components/Images/ReactImageAppear/ReactImageAppear';
import { ipfsGateway } from 'config';
import { buildRouteLinks } from 'routes';
import Filters, { matchFilter } from '../../../sdk/types/Filters';
import style from './ItemsInventory.module.scss';

interface IProps {
    className?: string,
    items: any[],
    type: string,
    hasFilter: boolean,
    filters?: Filters
}

const ItemsInventory = ({
    className = '',
    items,
    type,
    hasFilter,
    filters
}: IProps) => {
    const title = 'My ' + type.charAt(0).toUpperCase() + type.slice(1);

    return (
        <div className={style['all-items'] + ' ' + className + ' ' + style[type] + (hasFilter ? ' ' + style['has-filter'] : '')}>
            <h2>{title}</h2>
            <div className={style.content}>
                {fillContent()}
            </div>
        </div>
    );

    function fillContent() {

        const matchedItems = items
            .filter(item => match(item));

        if (matchedItems.length > 0) {
            return matchedItems
                .map((item: any, index: number) => <Item key={index} item={item} type={type} />);
        }
        else {
            return <p>You own 0 {type}.</p>
        }
    }

    function match(item: any) {
        return !filters || !hasFilter || (filters && matchFilter(filters, item));
    }
};

export default ItemsInventory;

interface IItemProps {
    item: {
        name: string,
        amount: number,
        thumbnailCID: string,
        id: string
    },
    type: string
}

const Item = ({
    item,
    type
}: IItemProps) => {

    return (
        <div className={style.item} onClick={() => {
            window.location.href = buildRouteLinks.inspect(type, item.id);
        }}>
            <ReactImageAppear src={ipfsGateway + item.thumbnailCID} />
            <div className={style.name}>{item.name}</div>
            {type == 'items' &&
                <div className={style.count}>{item.amount}</div>
            }
        </div>
    );
}