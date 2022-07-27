import * as React from 'react';
import { ifpsGateway } from 'config';
import Filters, { matchFilter } from './Filters';
import style from './item-inventory.module.scss';

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
                {
                    items.map((item: any, index: number) => {
                        const isMatched = (filters && matchFilter(filters, item)) || !filters;

                        if (isMatched) {
                            return (
                                <div className={style.item} key={index}>
                                    <img src={ifpsGateway + item.thumbnailCID} />
                                    <div className={style.name}>{item.name}</div>
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })
                }
            </div>
        </div>
    );
};

export default ItemsInventory;
