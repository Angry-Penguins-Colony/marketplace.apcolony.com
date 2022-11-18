import * as React from 'react';
import style from './Item.module.scss';

export const Item = ({
    item,
    className = '',
    subProperty,
    onClick = () => {
        // do nothing
    }
}: {
    item: {
        displayName: string,
        id: string,
        thumbnailUrls: {
            high: string;
        }
    },
    className?: string;
    subProperty?: JSX.Element | string;
    onClick?: () => void;
}) => {
    return (
        <div className={style.item + ' ' + className} onClick={onClick}>
            <div className={style.infos}>
                <p className={style.name}>
                    {item.displayName}
                </p>
                {subProperty &&
                    <p className={style.subProperty}>
                        {subProperty}
                    </p>}
            </div>
            <div className={style.thumbnail}>
                <img src={item.thumbnailUrls.high} alt={item.displayName} />
            </div>
        </div>
    );
};
