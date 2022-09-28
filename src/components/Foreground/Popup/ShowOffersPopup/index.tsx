import React from 'react';
import { IOffer } from '@apcolony/marketplace-api';
import Button from 'components/Abstract/Button/Button';
import Popup, { IPopupProps } from '../Generic/Popup';

interface IProps extends IPopupProps {
    offers: IOffer[]
}

const ShowOffersPopup = (props: IProps) => {
    return <Popup haveCloseButton={true} {...props} >
        <div className="flex flex-col">
            <div className="flex flex-row justify-between">
                <div className="text-2xl font-bold">Offers</div>
                <div className="text-2xl font-bold">Price</div>
            </div>
            <div className="flex flex-col">
                {props.offers.map((offer, index) => {
                    return <div className="flex flex-row justify-between" key={index}>
                        <Button type='cancel-outline'>Retire offer</Button>
                        <div className="text-xl">{offer.price.toString()}</div>
                    </div>
                })}
            </div>
        </div>
    </Popup>
}

export default ShowOffersPopup;