import React from 'react';
import { IGenericElement } from '@apcolony/marketplace-api';
import { Address } from '@elrondnetwork/erdjs/out';
import { useGetOwnedPenguins, useGetOwnedStakedPenguins } from '../api/useGetOwned';
import StakedType from 'sdk/types/StakedTypes';

function useGetStakingInventory(walletAddress: string) {
    const [inventoryElements, setElements] = React.useState<IGenericElement[] | undefined>(undefined);
    const [inventoryType, setInventoryType] = React.useState<StakedType>('unstaked');

    const penguins = useGetOwnedPenguins({ overrideAddress: Address.fromBech32(walletAddress) });
    const stakedPenguins = useGetOwnedStakedPenguins({ overrideAddress: Address.fromBech32(walletAddress) });

    React.useEffect(() => {
        updateInventory();
    }, [penguins, stakedPenguins, inventoryType]);

    return {
        inventoryElements,
        inventoryType,
        penguinsCount: penguins?.length,
        stakedPenguinsCount: stakedPenguins?.length,
        setInventoryType
    };

    function updateInventory() {
        switch (inventoryType) {
            case 'staked':
                setElements(stakedPenguins);
                break;

            case 'unstaked':
            default:
                setElements(penguins);
                break;
        }
    }
}

export default useGetStakingInventory;