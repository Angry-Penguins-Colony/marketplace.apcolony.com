import * as React from 'react';
import BigNumber from 'bignumber.js';
import Price from 'sdk/classes/Price';
import style from './SetPrice.module.scss';

const step = 0.1;
const maxCharacters = 6;

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

    if (price.length > maxCharacters) {
        console.warn('Price is too long');
        price = price.slice(0, maxCharacters);
    }

    // price input
    const priceInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        updatePriceInputWidth();
    }, [price])

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

            if (tmpPrice.length > maxCharacters) {
                tmpPrice = tmpPrice.slice(0, maxCharacters);
            }

            setPrice(tmpPrice);
        };
    }

    function decrement() {
        console.log('decrement');
        const newPrice = (new BigNumber(price).minus(step));

        if (newPrice.isLessThanOrEqualTo(0) == true) {
            setPrice('0');
        }
        else {
            setPrice(newPrice.toString());
        }

    }

    function increment() {
        console.log('increment');


        const newPrice = (new BigNumber(price).plus(step)).toString()
        setPrice(newPrice);
    }

    function updatePriceInputWidth() {
        if (priceInputRef.current == undefined) return;

        const priceLength = Math.max(price.toString().length, 2);

        console.log(priceLength);

        priceInputRef.current.style.width = (priceLength * 0.88) + 'rem';
    }
}

export default SetPrice;