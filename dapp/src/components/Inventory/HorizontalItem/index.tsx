import * as React from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { buildRouteLinks } from 'routes';
import style from './index.module.scss';

export const HorizontalItem = ({
    item,
    className = '',
    subProperty,
    onClick = () => {
        // do nothing
    },
    navigate = false,
}: {
    item?: {
        id: string;
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
    return withLink(
        <div className={style.item + ' ' + className} onClick={onClick}>
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
    );

    function withLink(child: JSX.Element) {
        if (navigate && item) {
            return (
                <Link to={buildRouteLinks.inspect('items', item.id)}>
                    {child}
                </Link>
            );
        }
        else {
            return child;
        }

    }
};