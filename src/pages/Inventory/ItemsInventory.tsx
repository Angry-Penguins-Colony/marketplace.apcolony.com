import * as React from 'react';
import style from './item-inventory.module.scss';

const ItemsInventory = ({
    className = '',
    items,
    type,
    hasFilter
}: {
    className?: string,
    items: any[],
    type: string,
    hasFilter: boolean,
}) => {
    const title = 'My ' + type.charAt(0).toUpperCase() + type.slice(1);

    return (
        <div className={style['all-items'] + ' ' + className + ' ' + style[type] + (hasFilter ? ' ' + style['has-filter'] : '')}>
            <h2>{title}</h2>
            <div className={style.content}>
                {
                    items.map((item: any, index: number) => {
                        return (
                            <div className={style.item} key={index}>
                                <img src={item.image} />
                                <div className={style.name}>{item.name}</div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default ItemsInventory;
