import * as React from 'react';
import style from './rounded-list.module.scss';

export interface IRoundedItem {
    name: string;
    number: number;
    onClick?: () => void;
    selected?: boolean;
}

const RoundedList = ({
    items,
    className,
}: {
    items: IRoundedItem[],
    className?: string,
}) => {
    return (
        <div className={style['rounded-list'] + ' ' + className}>
            {
                items
                    .map((item, index) => (
                        <div className={style.item + ' ' + (item.selected ? style.current : '')} key={index} onClick={item.onClick}>
                            <span className={style.name}>{item.name}</span>
                            <span className={style.number}>{item.number}</span>
                        </div>
                    ))
            }
        </div>
    );
};

export default RoundedList;