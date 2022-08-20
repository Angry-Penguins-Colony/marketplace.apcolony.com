import * as React from 'react';
import style from './square-item.module.scss';

const SquareItem = ({
    thumbnail,
    name,
    price = -1,
    onClick = () => {
        // do nothing
    },
    className = '',
}: {
    thumbnail: string,
    name: string,
    price?: number,
    onClick?: () => void,
    className?: string,
}) => {
    return (
        <div className={style['square-item'] + ' ' + className} onClick={onClick}>
            <img src={thumbnail} alt={name} />
            <div className={style.infos}>
                <div className={style.name}>{name}</div>
                {
                    price !== -1 &&
                    <div className={style.price}>
                        <span className={style.label}>Price: </span>
                        <span className={style.value}>{price} EGLD</span>
                    </div>
                }
            </div>
        </div>
    );
};

export default SquareItem;