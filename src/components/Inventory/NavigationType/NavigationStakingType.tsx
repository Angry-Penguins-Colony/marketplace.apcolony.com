import * as React from 'react';
import StakedType from 'sdk/types/StakedTypes';
import style from './NavigationType.module.scss';

/* TODO : Find a way to merge this file and NavigationType.tsx */

const NavigationStakedType = ({
    className = '',
    onChangeType,
    itemsType,
    stakedPenguinsCount,
    unstakedPenguinsCount
}: {
    className?: string,
    onChangeType?: (type: StakedType) => void,
    itemsType?: StakedType,
    stakedPenguinsCount?: number,
    unstakedPenguinsCount?: number
}) => {
    return (
        <section id={style['navigation-type']} className={className}>
            <span className={style.item + (itemsType === 'unstaked' ? ' ' + style.active : '')} onClick={() => onChangeType && onChangeType('unstaked')}>Unstaked ({unstakedPenguinsCount != undefined && unstakedPenguinsCount})</span>
            <span className={style.item + (itemsType === 'staked' ? ' ' + style.active : '')} onClick={() => onChangeType && onChangeType('staked')}>Staked ({stakedPenguinsCount != undefined && stakedPenguinsCount})</span>
        </section>
    );
};

export default NavigationStakedType;
