import * as React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { ipfsGateway } from 'config';
import style from './item.module.scss';

export const Item = ({
    item,
    className = '',
    displayId = true,
    onClick = () => {
        // do nothing
    }
}: {
    item: IItem,
    className?: string;
    displayId?: boolean;
    onClick?: () => void;
}) => {
    return (
        <div className={style.item + ' ' + className} onClick={onClick}>
            <div className={style.infos}>
                <p className={style.name}>{item.name}</p>
                {
                    displayId &&
                    <p className={style.id}>#{item.id}</p>
                }
                {/* <p className={style.rarity}>Rarity: {item.rarity}%</p> */}
            </div>
            <div className={style.thumbnail}>
                <img src={ipfsGateway + item.thumbnailCID} alt={item.name} />
            </div>
        </div>
    );
};
