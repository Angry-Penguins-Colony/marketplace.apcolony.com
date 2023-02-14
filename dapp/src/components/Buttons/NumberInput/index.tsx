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

    return <>
        <div className={style['number-input']}>
            <button className={style.minus} onClick={decrement} disabled={canDecrement() == false}>
                <FontAwesomeIcon icon={minusIcon} />
            </button>

            <input className={style.quantity} onChange={onManualChange} min={min} max={max} name="quantity" value={value} type="number" />

            <button className={style.plus} onClick={increment} disabled={canIncrement() == false}>
                <FontAwesomeIcon icon={plusIcon} />
            </button>
        </div>
    </>;

    function onManualChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newValue = parseInt(e.target.value);

        if (isNumberBetweenTwoValues(newValue, min, max)) {
            onChanged(newValue);
        }
    }



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

function isNumberBetweenTwoValues(v: number, min: number | undefined, max: number | undefined) {
    if (min != undefined && max != undefined) {
        return v >= min && v <= max;
    }
    else if (min != undefined) {
        return v >= min;
    }
    else if (max != undefined) {
        return v <= max;
    }
    else {
        return true;
    }
}