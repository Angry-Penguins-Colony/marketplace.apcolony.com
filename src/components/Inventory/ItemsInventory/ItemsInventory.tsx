import * as React from 'react';
import { IGenericElement } from '@apcolony/marketplace-api';
import { Link } from 'react-router-dom';
import Loading from 'components/Abstract/Loading';
import ReactImageAppear from 'components/Images/ReactImageAppear/ReactImageAppear';
import { buildRouteLinks } from 'routes';
import CategoriesType from 'sdk/types/CategoriesType';
import Filters from '../../../sdk/types/Filters';
import style from './ItemsInventory.module.scss';

interface IProps {
    className?: string,
    items?: IGenericElement[],
    amountById: Record<string, number>,
    type: CategoriesType,
    hasFilter: boolean,
    filters?: Filters,
    makeItemComponent?: (item: IGenericElement) => JSX.Element
}

const ItemsInventory = ({
    className = '',
    items,
    type,
    hasFilter,
    amountById,
    makeItemComponent = (item) => {
        return <Item
            key={item.id}
            item={{
                amount: amountById[item.id],
                ...item
            }}
            type={type} />
    }
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

        if (items) {

            const matchedItems = items
                .filter(item => match(item));

            if (matchedItems.length > 0) {
                return matchedItems
                    .map(item => makeItemComponent(item));
            }
            else {
                return <p>You own 0 {type}.</p>
            }
        }
        else {
            return <Loading size="large" />
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
    type: CategoriesType,
    children?: React.ReactNode
}

const Item = ({
    item,
    type,
    children
}: IItemProps) => {

    return (
        <Link to={buildRouteLinks.inspect(type, item.id)}>
            <div className={style.item}>
                <ReactImageAppear src={item.thumbnailUrls.small} />
                <div className={style.name}>{item.name}</div>
                {(item.amount && type == 'items') &&
                    <div className={style.count}>{item.amount}</div>
                }

                {children}
            </div>
        </Link>
    );
}