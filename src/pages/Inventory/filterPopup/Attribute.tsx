import * as React from 'react';
import CheckIcon from 'components/Icons/CheckIcon';
import style from './attribute.module.scss';

export const Attribute = ({
    className = '', name, number, value, isSelected = false, isTmpSelected = false, toggle = function () {
        // do nothing
    }
}: {
    className?: string;
    name: string;
    number: number;
    value: string;
    isSelected?: boolean;
    isTmpSelected?: boolean;
    toggle?: () => void;
}) => {

    return (
        <div className={style.attribute + ' ' + className + ' ' + (isTmpSelected ? style.active : '')} onClick={toggle}>
            <div className={style.name}>{name}</div>
            <div className={style.number}>{number}</div>
            <div className={style.check}>
                <CheckIcon />
            </div>
        </div>
    );
};
