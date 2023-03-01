import React from 'react';
import { IOffer } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import BigNumber from 'bignumber.js';
import AddressWrapper from 'components/AddressWrapper';
import Popup, { IPopupProps } from '../Generic/Popup';
import style from './index.module.scss';

interface IProps extends IPopupProps {
    offers: IOffer[],
}

const ShowOffersPopup = (props: IProps) => {

    const { address } = useGetAccountInfo();

    return <Popup haveCloseButton={true} {...props} >

        <p className={style.title}>Offers</p>

        <table className="table">
            <thead>
                <tr>
                    <th>Price</th>
                    <th>Seller</th>
                </tr>
            </thead>
            <tbody>
                {props.offers
                    .sort((a, b) => new BigNumber(a.price).isGreaterThan(b.price) ? 1 : -1)
                    .map((offer, index) => {
                        return <tr key={index}>
                            <td className='align-middle'>
                                {offer.price.toString()} EGLD
                            </td>
                            <td>
                                {
                                    address == offer.seller ?
                                        <p>you</p>
                                        :
                                        <AddressWrapper totalLength={30} bech32={offer.seller} />
                                }
                            </td>
                        </tr>;
                    })}
            </tbody>
        </table>
    </Popup>
}

export default ShowOffersPopup;