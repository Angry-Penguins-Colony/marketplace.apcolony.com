import * as React from 'react';
import { IGenericElement } from '@apcolony/marketplace-api';
import ReactImageAppear from 'components/Images/ReactImageAppear/ReactImageAppear';
import { buildRouteLinks } from 'routes';
import CategoriesType from 'sdk/types/CategoriesType';
import Filters from '../../../sdk/types/Filters';
import style from './ItemsInventory.module.scss';

export interface IInventoryItem {
    name: string;
    amount: number;
    thumbnailWebUri: string;
    id: string;
}

interface IProps {
    className?: string,
    items: IGenericElement[],
    amountById: Record<string, number>,
    type: CategoriesType,
    hasFilter: boolean,
    filters?: Filters
}

const ItemsInventory = ({
    className = '',
    items,
    type,
    hasFilter,
    amountById
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
                .map((item: IGenericElement, index: number) => <Item key={index} item={{
                    amount: amountById[item.id],
                    ...item
                }} type={type} />);
        }
        else {
            return <p>You own 0 {type}.</p>
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function match(item: IGenericElement) {
        return true;
    }
};

export default ItemsInventory;

interface IItemProps {
    item: {
        name: string,
        amount: number,
        thumbnailUrls: {
            small: string;
        },
        id: string
    },
    type: CategoriesType
}

const Item = ({
    item,
    type
}: IItemProps) => {

    return (
        <div className={style.item} onClick={() => {
            window.location.href = buildRouteLinks.inspect(type, item.id);
        }}>
            <ReactImageAppear src={item.thumbnailUrls.small} />
            <div className={style.name}>{item.name}</div>
            {(item.amount && type == 'items') &&
                <div className={style.count}>{item.amount}</div>
            }
        </div>
    );
}