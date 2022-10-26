import React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import useGetUserOwnedAmount from 'sdk/hooks/api/useGetUserOwnedAmount';
import SubProperties from '../SubProperties';

interface Props {
    item: IItem
}

const ItemSubProperties = ({ item }: Props) => {

    const { address } = useGetAccountInfo();
    const userInventory = useGetUserOwnedAmount();

    const itemOwnedAmount = userInventory && (userInventory['items'][item.id] ?? 0);

    const properties = [];

    properties.push(`${item.supply} of total supply`);

    if (address) {
        properties.push(`${itemOwnedAmount ?? '--'} owned by you `);
    }

    return <SubProperties properties={properties} />
}

export default ItemSubProperties