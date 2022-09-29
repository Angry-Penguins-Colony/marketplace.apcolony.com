import * as React from 'react';
import Price from 'sdk/classes/Price';
import style from './SetPrice.module.scss';

const SetPrice = ({
    floorPrice = new Price(0, 1),
    price = '0',
    setPrice = () => {
        // do nothing
    },
    className = '',
}: {
    floorPrice: Price;
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
                <div className={style.control + ' ' + style.minus} onClick={() => decrement()}><span>-</span></div>
                <div className={style.input}>
                    <input type="number" value={price} onChange={onChange()} ref={priceInputRef} />
                    <span className={style.currency}>EGLD</span>
                </div>
                <div className={style.control + ' ' + style.plus} onClick={() => increment()}><span>+</span></div>
            </div>
            <p className={style['floor-price']}>Floor price {floorPrice.toDenomination()} EGLD</p>
        </div>
    );

    function onChange(): React.ChangeEventHandler<HTMLInputElement> | undefined {
        return (event) => {
            let tmpPrice = event.target.value || '0';
            if (tmpPrice[0] == '0' && tmpPrice.length != 1) {
                tmpPrice = tmpPrice.substring(1);
            }
            if (priceInputRef.current) {
                priceInputRef.current.style.width = (((tmpPrice.length < 1 ? 1 : tmpPrice.length) + 1) * 0.84) + 'rem';
            }
            setPrice(tmpPrice);
        };
    }

    function decrement() {
        console.log('decrement');
        let newPrice = parseFloat(price) - 1;

        if (newPrice < 0) {
            newPrice = 0;
        }

        setPrice(newPrice.toString());
    }

    function increment() {
        console.log('increment');
        setPrice((parseFloat(price) + 1).toString());
    }
}

export default SetPrice;