import * as React from 'react';
import BigNumber from 'bignumber.js';
import style from './style.module.scss';

export const GenericItemExplorer = (
    {
        thumbnail,
        name,
        floorPrice,
        count = 1,
        onClick = () => {
            // do nothing
        },
    }: {
        thumbnail: string;
        name: string;
        floorPrice: BigNumber;
        count?: number;
        onClick?: () => void;
    }
) => {
    return (
        <div className={style['item-or-penguin']} onClick={onClick}>
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
                    <span className={style.price}>{floorPrice.toString()} EGLD</span>
                </p>
            </div>
        </div>
    );
};
