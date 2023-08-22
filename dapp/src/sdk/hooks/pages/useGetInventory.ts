import React from 'react';
import { IGenericElement, IPenguin } from '@apcolony/marketplace-api';
import { Address } from '@multiversx/sdk-core/out';
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

    function calculateIceSum(penguin: IPenguin) {
        let iceSum = 5;
    
        for (const slot in penguin.equippedItems) {
            const item = penguin.equippedItems[slot];
            iceSum += item.stakePoints;
        }
    
        return iceSum;
    }

    return {
        inventoryElements,
        inventoryType,
        inventoryOffers,
        penguinsCount: owned?.penguins.length,
        itemsCount: owned && owned.items.reduce((acc, item) => acc + item.ownedAmount, 0),
        eggsCount: owned && owned.eggs.reduce((acc, egg) => acc + egg.ownedAmount, 0),
        totalOffers: totalOffersCount,
        totalIcesum: owned?.penguins.reduce((accumulator, penguin) => {
            return accumulator + calculateIceSum(penguin);
        }, 0),
        setInventoryType
    };

    function updateInventory() {
        setInventoryElements(owned && owned[inventoryType]);
        setInventoryOffers(offersOfAccount && offersOfAccount.associated[inventoryType]);
    }
}

export default useGetInventory;