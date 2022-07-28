import React from 'react';
import { IAddress, IPenguin, IEgg } from '@apcolony/marketplace-api/out';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import axios from 'axios';
import { marketplaceApi } from 'config';



export function useGetOwnedPenguins(options?: IOptions<IPenguin>): IPenguin[] | undefined {
    return useGetOwned<IPenguin>('penguins', options);
}

export function useGetOwnedEggs(options?: IOptions<IEgg>): IEgg[] | undefined {
    return useGetOwned<IEgg>('eggs', options);
}

interface IOptions<T> {
    onLoaded?: (penguins: T[]) => void;
    overrideAddress?: IAddress;
}

function useGetOwned<T>(urlSuffix: string, options?: IOptions<T>): T[] | undefined {
    const [owned, setOwned] = React.useState<T[] | undefined>(undefined);
    let { address: userAddress } = useGetAccountInfo();

    if (!userAddress) {
        if (process.env.NODE_ENV == 'production') {
            throw new Error('To get owned penguins, the user must be logged in.');
        }
        else {
            const fakeAddress = 'erd1c0hhz2xcnsdk6630um7k8jrg2k8zvvpwf39e83xsg8mq68rsettqzdhhjq';
            console.warn('To get owned penguins, the user must be logged in. For dev purpose, we faked a connected user with the address ' + fakeAddress);
            userAddress = fakeAddress;
        }
    }

    React.useEffect(() => {
        async function get() {
            const url = marketplaceApi + (options?.overrideAddress ?? userAddress) + '/' + urlSuffix;
            const res = await axios.get(url)

            const loadedPenguins = res.data.data;
            setOwned(loadedPenguins);

            if (options?.onLoaded != null) {
                options?.onLoaded(loadedPenguins);
            }
        }

        get();
    }, []);

    return owned;
}