import React from 'react';
import { IAddress, IPenguin, IEgg, IItem } from '@apcolony/marketplace-api/out';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import doGetGeneric from 'sdk/api/doGetGeneric';

export function useGetOwnedPenguins(options?: IOptions<IPenguin>): IPenguin[] | undefined {
    return useGetOwned<IPenguin>('penguins', options);
}

export function useGetOwnedEggs(options?: IOptions<IEgg>): IEgg[] | undefined {
    return useGetOwned<IEgg>('eggs', options);
}

export function useGetOwnedItems(options?: IOptions<IItem>): IItem[] | undefined {
    return useGetOwned<IItem>('items', options);
}

export function useGetOwnedStakedPenguins(options?: IOptions<IPenguin>): IPenguin[] | undefined {
    return useGetOwned<IPenguin>('staking', options);
}

interface IOptions<T> {
    onLoaded?: (penguins: T[]) => void;
    overrideAddress?: IAddress;
}

function useGetOwned<T>(type: string, { overrideAddress, onLoaded }: IOptions<T> = {}): T[] | undefined {
    const [owned, setOwned] = React.useState<T[] | undefined>(undefined);
    let { address: userAddress } = useGetAccountInfo();

    if (!userAddress) {
        if (process.env.NODE_ENV == 'production') {
            throw new Error('To get owned penguins, the user must be logged in.');
        }
        else {
            const fakeAddress = 'erd1fmsn8v577rjhah8rfx867e3l069jw84pgud5h0wjc67348p4fmwsjj5nqj';
            userAddress = fakeAddress;
        }
    }

    React.useEffect(() => {
        async function get() {
            const url = 'accounts/' + (overrideAddress ?? userAddress) + '/owned/' + type;
            const res = await doGetGeneric(url);

            const loadedPenguins = res.data.data;
            setOwned(loadedPenguins);

            if (onLoaded) {
                onLoaded(loadedPenguins);
            }
        }

        get();
    }, []);

    return owned;
}