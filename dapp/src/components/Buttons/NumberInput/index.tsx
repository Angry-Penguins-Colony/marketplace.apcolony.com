import React from 'react';
import { faPlus as plusIcon, faMinus as minusIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './index.module.scss';

interface IProps {
    value: number;
    onChanged: (newValue: number) => void;
    step?: number;
    min?: number;
    max?: number;
}

const NumberInput = ({ value, onChanged, step = 1, min, max }: IProps) => {

    const minusClassName = [
        style.minus,
        style.centerText,
        canDecrement() ? '' : style.disabled
    ].join(' ');

    const plusClassName = [
        style.plus,
        style.centerText,
        canIncrement() ? '' : style.disabled
    ].join(' ')

    return <>
        <div className={style.mintButton}>
            <div className={style.numberSelector}>
                <div className={minusClassName} onClick={decrement}>
                    <FontAwesomeIcon icon={minusIcon} />
                </div>
                <div className={style.numberSelect + ' ' + style.centerText}>
                    {value}
                </div>
                <div className={plusClassName} onClick={increment} >
                    <FontAwesomeIcon icon={plusIcon} />
                </div>
            </div>
        </div>
    </>;

    function canDecrement() {
        if (min != undefined) {
            return value - step >= min;
        } else {
            return true;
        }
    }

    function canIncrement() {
        if (max != undefined) {
            return value + step <= max;
        }
        else {
            return true;
        }
    }

    function decrement() {
        if (canDecrement()) {
            onChanged(value - step);
        }
    }

    function increment() {
        if (canIncrement()) {
            onChanged(value + step);
        }
    }
};

export default NumberInput;