import React from 'react';
import { stakeTokenName } from 'config';
import SubProperties from '../SubProperties';

interface Props {
    supply: number;
    ownedAmount: number;
    ice: number;
}

const ItemSubProperties = ({ supply, ownedAmount, ice }: Props) => {

    const properties = [];

    properties.push(`${ownedAmount} owned out of ${supply} edition`);
    properties.push(`${ice} ${stakeTokenName}`);



    return <SubProperties properties={properties} />
}

export default ItemSubProperties