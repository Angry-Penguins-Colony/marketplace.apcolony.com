import React from 'react';
import { useGetPendingTransactions, useGetSuccessfulTransactions } from '@elrondnetwork/dapp-core/hooks';
import { SignedTransactionsType } from '@elrondnetwork/dapp-core/types';
import ITransactionFilter from './transactionsFilters/ITransactionFilter';
import usePrevious from './usePrevious';

const useGetOnTransactionSuccesful = (onTransactionSuccesful: (sessionId: string) => void, transactionFilter: ITransactionFilter) => {
    const { pendingTransactions } = useGetPendingTransactions();
    const { successfulTransactions } = useGetSuccessfulTransactions()

    const previousPendingTransactions = usePrevious(pendingTransactions);

    React.useEffect(() => {

        if (!previousPendingTransactions) return;

        const nowSuccesfulSessionIds = intersect(previousPendingTransactions, successfulTransactions)
            .filter(sessionId => filter(sessionId, successfulTransactions, transactionFilter));

        for (const sessionId of nowSuccesfulSessionIds) {
            onTransactionSuccesful(sessionId);
        }
    }, [pendingTransactions, successfulTransactions])

};

export default useGetOnTransactionSuccesful;

// source: https://stackoverflow.com/questions/34392741/best-way-to-get-intersection-of-keys-of-two-objects
function intersect(o1: any, o2: any) {
    const [k1, k2] = [Object.keys(o1), Object.keys(o2)];
    const [first, next] = k1.length > k2.length ? [k2, o1] : [k1, o2];
    return first.filter(k => k in next);
}


function filter(
    sessionId: string,
    signedTransactions: SignedTransactionsType,
    transactionFilter: ITransactionFilter):
    boolean {

    const signedTransaction = signedTransactions[sessionId];
    if (!signedTransaction) return false;

    const { transactions } = signedTransaction;
    if (!transactions) return false;

    return transactions.some((tx: any) => transactionFilter.contains(Buffer.from(tx.data, 'base64').toString()));
}