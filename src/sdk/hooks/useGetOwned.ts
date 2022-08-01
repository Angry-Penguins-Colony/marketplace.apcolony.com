import React from 'react';
import { IAddress, IPenguin, IEgg, IItem } from '@apcolony/marketplace-api/out';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import axios from 'axios';
import { marketplaceApi } from 'config';

export function useGetOwnedPenguins(options?: IOptions<IPenguin>): IPenguin[] | undefined {
    return useGetOwned<IPenguin>('penguins', options);
}

export function useGetOwnedEggs(options?: IOptions<IEgg>): IEgg[] | undefined {
    return useGetOwned<IEgg>('eggs', options);
}

export function useGetOwnedItems(options?: IOptions<IItem>): IItem[] | undefined {
    return useGetOwned<IItem>('items', options);
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
            const fakeAddress = 'erd1fmsn8v577rjhah8rfx867e3l069jw84pgud5h0wjc67348p4fmwsjj5nqj';
            userAddress = fakeAddress;
        }
    }

    React.useEffect(() => {
        async function get() {
            const res = await doGetGeneric((options?.overrideAddress ?? userAddress) + '/' + urlSuffix);

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

function doGetGeneric(urlSuffix: string) {
    const url = marketplaceApi
        + (process.env.REACT_APP_USE_PLACEHOLDERS_CALL === '1' ? 'placeholder/' : '')
        + urlSuffix;

    console.log(url);

    return axios.get(url);
}