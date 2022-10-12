import React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { Address } from '@elrondnetwork/erdjs/out';
import useGetOffersOfCategory from './useGetOffersOfCategory';
import { useGetOwnedItems } from './useGetOwned';

export function useGetOwnedAndOnSaleItems(overrideAddress?: Address): IItem[] | undefined {
    const ownedItems = useGetOwnedItems({
        overrideAddress: overrideAddress,
    });

    const offersItems = useGetOffersOfCategory('items');

    const [offers, setItems] = React.useState<IItem[] | undefined>(undefined);

    React.useEffect(() => {
        if (ownedItems == null || offersItems == null) {
            return;
        }

        setItems([...ownedItems, ...offersItems.associatedItems as IItem[]]);
    }, [ownedItems, offersItems]);

    return offers;
}