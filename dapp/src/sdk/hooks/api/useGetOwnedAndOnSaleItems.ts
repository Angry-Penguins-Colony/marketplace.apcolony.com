import React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { Address } from '@elrondnetwork/erdjs/out';
import useGetOffersOfCategory from './useGetOffersOfCategory';
import { useGetOwnedItems } from './useGetOwned';

export function useGetOwnedAndOnSaleItems(overrideAddress?: Address): IItem[] | undefined {
    console.warn('deprecated use /owned/sales/:bech32 route instead');
    const ownedItems = useGetOwnedItems({
        overrideAddress: overrideAddress,
    });

    const { data: offersItems } = useGetOffersOfCategory('items');

    const [offers, setItems] = React.useState<IItem[] | undefined>(undefined);

    React.useEffect(() => {
        if (ownedItems == null || offersItems == null) {
            return;
        }

        setItems([...ownedItems, ...offersItems.associatedItems as IItem[]]);
    }, [ownedItems, offersItems]);

    return offers;
}