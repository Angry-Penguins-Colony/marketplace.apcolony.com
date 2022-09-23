import * as React from 'react';
import style from './SetPrice.module.scss';

const SetPrice = ({
    floorPrice = 0,
    price = '0',
    setPrice = () => {
        // do nothing
    },
    className = '',
}: {
    floorPrice: number;
    price: string;
    setPrice: (price: string) => void;
    className?: string;
}) => {

    // price input
    const priceInputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className={style['set-price'] + ' ' + className}>
            <h3>Set your price</h3>
            <div className={style['input-price']}>
                <div className={style.control + ' ' + style.minus}><span>-</span></div>
                <div className={style.input}>
                    <input type="number" value={price} onChange={(event) => {
                        let tmpPrice = event.target.value || '0';
                        if (tmpPrice[0] == '0' && tmpPrice.length != 1) {
                            tmpPrice = tmpPrice.substring(1);
                        }
                        if (priceInputRef.current) {
                            priceInputRef.current.style.width = (((tmpPrice.length < 1 ? 1 : tmpPrice.length) + 1) * 0.84) + 'rem';
                        }
                        setPrice(tmpPrice);
                    }} ref={priceInputRef} />
                    <span className={style.currency}>EGLD</span>
                </div>
                <div className={style.control + ' ' + style.plus}><span>+</span></div>
            </div>
            <p className={style['floor-price']}>Floor price {floorPrice} EGLD</p>
        </div>
    );
}

export default SetPrice;