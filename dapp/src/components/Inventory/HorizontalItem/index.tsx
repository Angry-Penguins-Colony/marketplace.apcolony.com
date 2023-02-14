import * as React from 'react';
import Skeleton from 'react-loading-skeleton';
import style from './index.module.scss';

export const HorizontalItem = ({
    item,
    className = '',
    subProperty,
    onClick = () => {
        // do nothing
    }
}: {
    item?: {
        displayName: string,
        thumbnailUrls: {
            high: string;
        }
    },
    className?: string;
    subProperty?: React.ReactNode;
    onClick?: () => void;
    navigate?: boolean;
}) => {
    return <div className={style.item + ' ' + className} onClick={onClick}>
        <div className={style.infos}>
            <p className={style.name}>
                {
                    item ? item.displayName : <Skeleton />
                }
            </p>
            <p className={style.subProperty}>
                {item ? subProperty : <Skeleton className='mt-2' />}
            </p>
        </div>
        <div className={style.thumbnail}>
            {
                item ?
                    <img className={style.img} src={item.thumbnailUrls.high} alt={item.displayName} loading="lazy" />
                    :
                    <Skeleton className={style.img} />
            }
        </div>
    </div>
};