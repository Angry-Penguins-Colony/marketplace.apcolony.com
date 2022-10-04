import * as React from 'react';
import style from './index.module.scss';

const MarketData = ({
    floorPrice,
    totalVolume,
    averagePrice,
    totalListed,
}: {
    floorPrice: number,
    totalVolume: number,
    averagePrice: number,
    totalListed: number,
}) => {
    return (
        <div className={style['market-data']}>
            <div className={style.item}>
                <div className={style.value}>{floorPrice} EGLD</div>
                <div className={style.label}>Floor Price</div>
            </div>
            <div className={style.item}>
                <div className={style.value}>{totalVolume} EGLD</div>
                <div className={style.label}>Total Volume</div>
            </div>
            <div className={style.item}>
                <div className={style.value}>{averagePrice} EGLD</div>
                <div className={style.label}>Average Price</div>
            </div>
            <div className={style.item}>
                <div className={style.value}>{totalListed}</div>
                <div className={style.label}>Total Listed</div>
            </div>
        </div>
    );
};

export default MarketData;