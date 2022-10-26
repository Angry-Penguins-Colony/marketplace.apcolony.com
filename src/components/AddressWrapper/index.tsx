import React from 'react';
import { explorer } from 'config';

interface Props {
    bech32: string;
    withLink?: boolean;
    totalLength?: number;
}

const AddressWrapper = ({ bech32: bech32, withLink = true, totalLength = 15 }: Props) => {

    const separator = '...';
    const sideWidth = (totalLength - separator.length) / 2;
    const croppped = bech32.slice(0, sideWidth) + separator + bech32.slice(-sideWidth);

    if (withLink) {
        return <a href={explorer.getAddress(bech32)} target="_blank" rel="noopener noreferrer">
            {croppped}
        </a>
    }
    else {
        return <>
            {croppped}
        </>
    }
};

export default AddressWrapper;