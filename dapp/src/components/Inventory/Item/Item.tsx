import * as React from 'react';
import Skeleton from 'react-loading-skeleton';
import style from './Item.module.scss';

export const Item = ({
    item,
    className = '',
    displayId = true,
    onClick = () => {
        // do nothing
    }
}: {
    item?: {
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
                    {item?.displayName || <Skeleton />}
                </p>
                {
                    displayId &&
                    <p className={style.id}>
                        {
                            item ?
                                <>#{item.id}</>
                                :
                                <Skeleton />
                        }
                    </p>
                }
            </div>
            <div className={style.thumbnail}>
                {
                    item ?
                        <img src={item.thumbnailUrls.high} alt={item.displayName} />
                        : <Skeleton />
                }
            </div>
        </div>
    );
};
