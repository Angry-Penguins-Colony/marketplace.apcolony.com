import React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import SubProperties from '../SubProperties';

interface Props {
    supply: number;
    ownedAmount: number;
}

const ItemSubProperties = ({ supply, ownedAmount }: Props) => {

    const { address } = useGetAccountInfo();

    const properties = [];

    properties.push(`${supply} of total supply`);

    if (address) {
        properties.push(`${ownedAmount} owned by you `);
    }

    return <SubProperties properties={properties} />
}

export default ItemSubProperties