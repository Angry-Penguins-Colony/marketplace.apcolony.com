import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { HorizontalItem } from 'components/Inventory/HorizontalItem';
import style from './index.module.scss'

interface Props {
    element?: {
        displayName: string,
        thumbnailUrls: {
            high: string;
        }
    },
    subProperty?: React.ReactNode;
}


export const ResponsiveElementThumbnail = ({ element: item, subProperty }: Props) => {
    return <>
        <HorizontalItem item={item} subProperty={subProperty} className={style.mobile} />

        <div className={style.desktop}>
            {
                item ?
                    <img loading="lazy" src={item.thumbnailUrls.high} alt="" className={style.img} />
                    : <Skeleton className={style.img} />
            }
            <div className={style.infos}>
                <div className={style.name}>{item?.displayName ?? <Skeleton />}  </div>
                <div className={style.price}>
                    {subProperty ?? <Skeleton className='mt-2' />}
                </div>
            </div>
        </div>
    </>
}