import * as React from 'react';
import style from './rounded-list.module.scss';

const RoundedList = ({
    items,
    className,
}: {
    items: {
        name: string,
        number: number,
        onClick?: () => void,
        current?: boolean,
    }[],
    className?: string,
}) => {
    return (
        <div className={style['rounded-list'] + ' ' + className}>
            {
                items.map((item, index) => (
                    <div className={style.item + ' ' + (item.current ? style.current : '')} key={index} onClick={item.onClick}>
                        <span className={style.name}>{item.name}</span>
                        <span className={style.number}>{item.number}</span>
                    </div>
                ))
            }
        </div>
    );
};

export default RoundedList;