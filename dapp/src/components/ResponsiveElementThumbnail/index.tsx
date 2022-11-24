import React from 'react';
import { IGenericElement } from '@apcolony/marketplace-api';
import { HorizontalItem } from 'components/Inventory/HorizontalItem';
import style from './index.module.scss'

interface Props {
    element: IGenericElement;
    subProperty: string;
}


export const ResponsiveElementThumbnail = ({ element: item, subProperty }: Props) => {
    return <>
        <HorizontalItem item={item} subProperty={subProperty} className={style.mobile} />

        <div className={style.desktop}>
            <img loading="lazy" src={item.thumbnailUrls.high} alt="" className={style.item} />
            <div className={style.infos}>
                <div className={style.name}>{item.displayName}</div>
                <div className={style.price}>
                    {subProperty}
                </div>
            </div>
        </div>
    </>
}