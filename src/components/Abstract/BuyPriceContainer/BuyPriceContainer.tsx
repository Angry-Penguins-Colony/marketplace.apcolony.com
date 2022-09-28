import * as React from 'react';
import { BigNumber } from 'bignumber.js';
import Button from '../Button/Button';
import style from './buy-price-container.module.scss';

const BuyPriceContainer = ({
    className = '',
    price,
    onBuy
}: {
    className?: string,
    price: BigNumber,
    onBuy: () => void
}) => {
    return (
        <section className={style.buy + ' ' + className}>
            <h2>Price</h2>
            <p className={style.price}>{price.toString()} EGLD</p>
            <Button onClick={onBuy} type='primary' className={style.desktop + ' ' + style.button}>Buy for {price.toString()} EGLD</Button>
            <Button onClick={onBuy} className={style.mobile + ' ' + style.button}>Buy for {price.toString()} EGLD</Button>
        </section>
    );
};

export default BuyPriceContainer;