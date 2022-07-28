import React from 'react';
import { IPenguin } from '@apcolony/marketplace-api/out';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import axios from 'axios';
import { marketplaceApi } from 'config';


export default function useGetOwnedPenguins(onLoaded?: (penguins: IPenguin[]) => void): IPenguin[] | undefined {

    const [penguins, setPenguins] = React.useState<IPenguin[] | undefined>(undefined);
    let { address } = useGetAccountInfo();

    if (!address) {
        if (process.env.NODE_ENV == 'production') {
            throw new Error('To get owned penguins, the user must be logged in.');
        }
        else {
            const fakeAddress = 'erd1c0hhz2xcnsdk6630um7k8jrg2k8zvvpwf39e83xsg8mq68rsettqzdhhjq';
            console.warn('To get owned penguins, the user must be logged in. For dev purpose, we faked a connected user with the address ' + fakeAddress);
            address = fakeAddress;
        }
    }

    React.useEffect(() => {
        async function get() {
            const url = marketplaceApi + address + '/penguins';
            const res = await axios.get(url)

            const loadedPenguins = res.data.data;
            setPenguins(loadedPenguins);

            if (onLoaded) {
                onLoaded(loadedPenguins);
            }
        }

        get();
    }, []);

    return penguins;
}