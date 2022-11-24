import * as React from 'react';
import style from './index.module.scss';

export const HorizontalItem = ({
    item,
    className = '',
    subProperty,
    onClick = () => {
        // do nothing
    }
}: {
    item: {
        displayName: string,
        thumbnailUrls: {
            high: string;
        }
    },
    className?: string;
    subProperty?: React.ReactNode;
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
