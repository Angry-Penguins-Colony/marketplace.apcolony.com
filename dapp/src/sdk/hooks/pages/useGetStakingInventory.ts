import React from 'react';
import { IGenericElement, IPenguin } from '@apcolony/marketplace-api';
import { Address } from '@elrondnetwork/erdjs/out';
import StakedType from 'sdk/types/StakedTypes';
import { useGetOwnedPenguins, useGetOwnedStakedPenguins } from '../api/useGetOwned';

function useGetStakingInventory(walletAddress: string, penguinsStakedArray:Array<IPenguin> | undefined, penguinsUnstakedArray:Array<IPenguin> | undefined) {
    const [inventoryElements, setElements] = React.useState<IGenericElement[] | undefined>(undefined);
    const [inventoryType, setInventoryType] = React.useState<StakedType>('unstaked');

    React.useEffect(() => {
        updateInventory();
    }, [penguinsStakedArray, penguinsUnstakedArray, inventoryType]);

    return {
        inventoryElements,
        inventoryType,
        penguinsCount: penguinsUnstakedArray?.length,
        stakedPenguinsCount: penguinsStakedArray?.length,
        setInventoryType
    };

    function updateInventory() {
        switch (inventoryType) {
            case 'staked':
                setElements(penguinsStakedArray);
                break;

            case 'unstaked':
            default:
                setElements(penguinsUnstakedArray);
                break;
        }
    }
}

export default useGetStakingInventory;