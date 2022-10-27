import React from 'react';
import { IGenericElement } from '@apcolony/marketplace-api';
import { Address } from '@elrondnetwork/erdjs/out';
import CategoriesType from 'sdk/types/CategoriesType';
import useGetOffersOfAccount from '../api/useGetOffersOfAccount';
import { useGetOwnedItems, useGetOwnedPenguins } from '../api/useGetOwned';
import useGetUserOwnedAmount from '../api/useGetUserOwnedAmount';

function useGetInventory(walletAddress: string) {
    const [inventoryElements, setElements] = React.useState<IGenericElement[] | undefined>(undefined);
    const [inventoryType, setInventoryType] = React.useState<CategoriesType>('penguins');
    const [inventoryOffers, setInventoryOffers] = React.useState<IGenericElement[] | undefined>(undefined);

    const ownedAmount = useGetUserOwnedAmount();
    const penguins = useGetOwnedPenguins({ overrideAddress: Address.fromBech32(walletAddress) });
    const items = useGetOwnedItems({ overrideAddress: Address.fromBech32(walletAddress) });
    const { data: offersOfAccount } = useGetOffersOfAccount(Address.fromBech32(walletAddress));

    console.log(offersOfAccount);

    React.useEffect(() => {
        updateInventory();
    }, [penguins, items, inventoryType]);

    return {
        inventoryElements,
        inventoryType,
        inventoryOffers,
        ownedAmount,
        penguinsCount: penguins?.length,
        itemsCount: items?.length,
        setInventoryType
    };

    function updateInventory() {
        switch (inventoryType) {
            case 'items':
                setElements(items);
                setInventoryOffers(offersOfAccount?.associatedItems);
                break;

            case 'penguins':
            default:
                setElements(penguins);
                setInventoryOffers(offersOfAccount?.associatedPenguins);
                break;
        }
    }
}

export default useGetInventory;