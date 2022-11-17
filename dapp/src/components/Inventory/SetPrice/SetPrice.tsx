import * as React from 'react';
import BigNumber from 'bignumber.js';
import Price from 'sdk/classes/Price';
import { formatPrice, stringIsFloat } from './price';
import style from './SetPrice.module.scss';

const step = 0.1;
const maxCharacters = 6;

const SetPrice = ({
    floorPrice,
    price,
    setPrice = () => {
        // do nothing
    },
    className = '',
}: {
    floorPrice?: Price;
    price: string;
    setPrice: (price: string) => void;
    className?: string;
}) => {

    price = formatPrice(price, maxCharacters);

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
                    <input type="text" value={price} onChange={onChange()} ref={priceInputRef} />
                    <span className={style.currency}>EGLD</span>
                </div>
                <div className={style.control + ' ' + style.plus} onClick={() => increment()}><span>+</span></div>
            </div>
            <p className={style['floor-price']}>
                {
                    floorPrice ?
                        <>
                            Floor price {floorPrice.toDenomination()} EGLD
                        </>
                        :
                        <>
                            No items listed. Be the first!
                        </>
                }
            </p>
        </div>
    );

    function onChange(): React.ChangeEventHandler<HTMLInputElement> | undefined {
        return (event) => {

            console.log('onChange', event.target.value);

            const rawPrice = event.target.value || '0';
            const newPrice = formatPrice(rawPrice, maxCharacters);

            if (stringIsFloat(newPrice)) {
                console.log('setPrice', newPrice);
                setPrice(newPrice);
            }
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

        priceInputRef.current.style.width = (priceLength * 1) + 'rem';
    }
}

export default SetPrice;



