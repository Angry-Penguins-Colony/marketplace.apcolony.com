import React from 'react';
import { IAddress } from '@elrondnetwork/erdjs/out';
import { explorer } from 'config';

interface Props {
    address: IAddress;
}

const AddressWrapper = ({ address }: Props) => {

    const bech32 = address.bech32();

    return <a href={explorer.getAddress(address)} target="_blank" rel="noopener noreferrer">
        {bech32.slice(0, 6)}...{bech32.slice(-6)}
    </a>
};

export default AddressWrapper;