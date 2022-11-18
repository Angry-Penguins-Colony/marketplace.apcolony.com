import * as React from 'react';
import style from './Item.module.scss';

export const Item = ({
    item,
    className = '',
    displayId = true,
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
    displayId?: boolean;
    onClick?: () => void;
}) => {
    return (
        <div className={style.item + ' ' + className} onClick={onClick}>
            <div className={style.infos}>
                <p className={style.name}>
                    {item.displayName}
                </p>
                {
                    displayId &&
                    <p className={style.id}>
                        #{item.id}
                    </p>
                }
            </div>
            <div className={style.thumbnail}>
                <img src={item.thumbnailUrls.high} alt={item.displayName} />
            </div>
        </div>
    );
};
