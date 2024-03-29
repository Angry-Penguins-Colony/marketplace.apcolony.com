import * as React from 'react';
import CategoriesType from 'sdk/types/CategoriesType';
import style from './NavigationType.module.scss';

const NavigationType = ({
    className = '',
    onChangeType,
    itemsType,
}: {
    className?: string,
    onChangeType?: (type: CategoriesType) => void,
    itemsType?: CategoriesType,
}) => {
    return (
        <section id={style['navigation-type']} className={className}>
            <span className={style.item + (itemsType === 'penguins' ? ' ' + style.active : '')} onClick={() => onChangeType && onChangeType('penguins')}>
                Penguins
            </span>
            <span className={style.item + (itemsType === 'items' ? ' ' + style.active : '')} onClick={() => onChangeType && onChangeType('items')}>
                Items
            </span>
            <span className={style.item + (itemsType === 'eggs' ? ' ' + style.active : '')} onClick={() => onChangeType && onChangeType('eggs')}>
                Eggs
            </span>
        </section>
    );
};

export default NavigationType;
