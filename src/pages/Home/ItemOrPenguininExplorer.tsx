import * as React from 'react';
import style from './item-or-penguin-in-explorer.module.scss';

export const ItemOrPenguininExplorer = (
    {
        thumbnail,
        name,
        price,
        count = 1,
    }: {
        thumbnail: string;
        name: string;
        price: number;
        count?: number;
    }
) => {
    return (
        <div className={style['item-or-penguin']}>
            {
                (count > 1) && (
                    <div className={style.count}>
                        {count}
                    </div>
                )
            }
            <div className={style.thumbnail}>
                <img src={thumbnail} alt={'thumbnail of ' + name} />
            </div>
            <div className={style.info}>
                <h3 className={style.name}>{name}</h3>
                <p className={style.price}>
                    {
                        (count > 1) ? (
                            <span className={style.label}>Starting at : </span>
                        ) : (
                            <span className={style.label}>Price : </span>
                        )
                    }
                    <span className={style.price}>{price} EGLD</span>
                </p>
            </div>
        </div>
    );
};