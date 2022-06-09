import * as React from 'react';
import style from './navigation-type.module.scss';

const NavigationType = ({
    className = '',
    onChangeType,
    itemsType,
}: {
    className?: string,
    onChangeType?: (type: string) => void,
    itemsType?: string,
}) => {
    return (
        <section id={style['navigation-type']} className={className}>
            <span className={style.item + (itemsType === 'penguins' ? ' ' + style.active : '')} onClick={() => onChangeType && onChangeType('penguins')}>Penguins</span>
            <span className={style.item + (itemsType === 'eggs' ? ' ' + style.active : '')} onClick={() => onChangeType && onChangeType('eggs')}>Eggs</span>
            <span className={style.item + (itemsType === 'items' ? ' ' + style.active : '')} onClick={() => onChangeType && onChangeType('items')}>Items</span>
        </section>
    );
};

export default NavigationType;
