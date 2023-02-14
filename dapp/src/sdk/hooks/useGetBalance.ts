import React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import axios from 'axios';
import { marketplaceApi } from 'config';

interface IBalance {
    amount: number;
    decimals: number;
}

/**
 * Returns token balance if token is defined. Else, returns egld balance.
 */
export default function useGetBalance(tokenIdentifier?: string | 'EGLD') {
    const { account } = useGetAccountInfo();
    const [balance, setBalance] = React.useState<IBalance | undefined>(undefined);

    React.useEffect(() => {
        update();
    }, [tokenIdentifier]);

    return {
        balance,
        forceUpdate: update,
    };

    function update() {
        if (account.address == undefined) return;

        if ((tokenIdentifier == 'EGLD' || !tokenIdentifier)) {
            setBalance({
                amount: account.balance,
                decimals: 18
            });
        }
        else {
            const url = marketplaceApi + `accounts/${account.address}/tokens/${tokenIdentifier}`;
            axios.get(url)
                .then(({ data }: any) => {
                    setBalance({
                        amount: data.balance,
                        decimals: data.decimals
                    });
                });
        }
    }

}