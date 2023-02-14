import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';

/**
 * Returns token balance if token is defined. Else, returns egld balance.
 */
export default function useGetBalance(tokenIdentifier?: string | 'EGLD'): {
    balance: number,
    decimals: number
} {
    const { account } = useGetAccountInfo();

    if (tokenIdentifier == 'EGLD' || !tokenIdentifier) {
        return {
            balance: account.balance,
            decimals: 18
        };
    }
    else {
        throw new Error('Not implemented');
    }
}