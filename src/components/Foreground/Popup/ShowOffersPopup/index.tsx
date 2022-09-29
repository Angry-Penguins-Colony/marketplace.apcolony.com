import React from 'react';
import { IOffer } from '@apcolony/marketplace-api';
import Button from 'components/Abstract/Button/Button';
import Popup, { IPopupProps } from '../Generic/Popup';
import style from './index.module.scss';

interface IProps extends IPopupProps {
    offers: IOffer[],
    onRetire: (offer: IOffer) => void
}

const ShowOffersPopup = (props: IProps) => {
    return <Popup haveCloseButton={true} {...props} >

        <p className={style.title}>Offers</p>

        <table className="table">
            <tbody>
                {props.offers.map((offer, index) => {
                    return <tr key={index}>
                        <td className='align-middle'>{offer.price} EGLD</td>
                        <td><Button type='cancel-outline' onClick={() => props.onRetire(offer)}>Retire offer</Button>          </td>
                    </tr>;
                })}
            </tbody>
        </table>
    </Popup>
}

export default ShowOffersPopup;