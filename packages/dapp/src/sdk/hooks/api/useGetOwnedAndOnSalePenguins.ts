import React from 'react';
import { IPenguin } from '@apcolony/marketplace-api';
import { Address } from '@elrondnetwork/erdjs/out';
import useGetOffersOfCategory from './useGetOffersOfCategory';
import { useGetOwnedPenguins } from './useGetOwned';

export function useGetOwnedAndOnSalePenguins(overrideAddress?: Address): IPenguin[] | undefined {
    const ownedPenguins = useGetOwnedPenguins({
        overrideAddress: overrideAddress,
    });

    const { data: penguinsOffers } = useGetOffersOfCategory('penguins');

    const [penguins, setPenguins] = React.useState<IPenguin[] | undefined>(undefined);

    React.useEffect(() => {
        if (ownedPenguins == null || penguinsOffers == null) {
            return;
        }

        setPenguins([...ownedPenguins, ...penguinsOffers.associatedItems as IPenguin[]]);
    }, [ownedPenguins, penguinsOffers]);

    return penguins;
}