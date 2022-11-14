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
    const penguins = owned?.penguins;
    const items = owned?.items;
    const { data: offersOfAccount } = useGetOffersOfAccount(Address.fromBech32(walletAddress));

    React.useEffect(() => {
        updateInventory();
    }, [penguins, items, inventoryType]);

    return {
        inventoryElements,
        inventoryType,
        inventoryOffers,
        penguinsCount: penguins?.length,
        itemsCount: items?.length,
        setInventoryType
    };

    function updateInventory() {
        switch (inventoryType) {
            case 'items':
                setInventoryElements(items);
                setInventoryOffers(offersOfAccount?.associatedItems);
                break;

            case 'penguins':
            default:
                setInventoryElements(penguins);
                setInventoryOffers(offersOfAccount?.associatedPenguins);
                break;
        }
    }
}

export default useGetInventory;