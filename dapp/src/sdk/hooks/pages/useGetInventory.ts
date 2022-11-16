import React from 'react';
import { IGenericElement } from '@apcolony/marketplace-api';
import { Address } from '@elrondnetwork/erdjs/out';
import CategoriesType from 'sdk/types/CategoriesType';
import useGetOffersOfAccount from '../api/useGetOffersOfAccount';
import useGetUserOwnedAmount from '../api/useGetUserOwnedAmount';

function useGetInventory(walletAddress: string) {
    const [inventoryElements, setInventoryElements] = React.useState<IGenericElement[] | undefined>(undefined);
    const [inventoryType, setInventoryType] = React.useState<CategoriesType>('penguins');
    const [inventoryOffers, setInventoryOffers] = React.useState<IGenericElement[] | undefined>(undefined);

    const owned = useGetUserOwnedAmount(Address.fromBech32(walletAddress));
    const { data: offersOfAccount } = useGetOffersOfAccount(Address.fromBech32(walletAddress));
    const totalOffersCount = offersOfAccount && offersOfAccount.offers.length;

    React.useEffect(() => {
        updateInventory();
    }, [owned, offersOfAccount, inventoryType]);

    return {
        inventoryElements,
        inventoryType,
        inventoryOffers,
        penguinsCount: owned?.penguins.length,
        itemsCount: owned?.items.length,
        eggsCount: owned?.eggs.length,
        totalOffers: totalOffersCount,
        setInventoryType
    };

    function updateInventory() {
        setInventoryElements(owned && owned[inventoryType]);
        setInventoryOffers(offersOfAccount && offersOfAccount.associated[inventoryType]);
    }
}

export default useGetInventory;