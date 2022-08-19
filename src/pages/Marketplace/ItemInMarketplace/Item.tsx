import * as React from 'react';
import style from './item.module.scss';

export const Item = ({
    item
}: {
    item: {
        id: string;
        type: string;
        name: string;
        thumbnail: string;
        rarity: number;
    };
}) => {
    return (
        <div className={style.item}>
            <div className={style.infos}>
                <p className={style.name}>{item.name}</p>
                <p className={style.id}>#{item.id}</p>
                <p className={style.rarity}>Rarity: {item.rarity}%</p>
            </div>
            <div className={style.thumbnail}>
                <img src={item.thumbnail} alt={item.name} />
            </div>
        </div>
    );
};
