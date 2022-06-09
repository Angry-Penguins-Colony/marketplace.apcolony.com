import * as React from 'react';
import style from './item-inventory.module.scss';

const ItemsInventory = ({
    className = '',
    items,
    title
}: {
    className?: string,
    items: any[],
    title: string
}) => {
    return (
        <div className={style['all-items'] + ' ' + className}>
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
