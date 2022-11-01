import React from 'react';
import { Link } from 'react-router-dom';
import { buildRouteLinks } from 'routes';

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
        return <Link to={buildRouteLinks.inventory(bech32)}>
            {croppped}
        </Link>
    }
    else {
        return <>
            {croppped}
        </>
    }
};

export default AddressWrapper;