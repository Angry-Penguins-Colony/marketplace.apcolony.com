import React from 'react';
import { useGetPendingTransactions } from '@multiversx/sdk-dapp/hooks';
import ITransactionFilter, { filter } from './transactionsFilters/ITransactionFilter';

const useGetOnNewPendingTransaction = (onNewPendingTrnasaction: (sessionId: string) => void, transactionFilter: ITransactionFilter) => {
    const [processedSessionIds, setProcessedSessionIds] = React.useState<string[]>([]);
    const { pendingTransactions } = useGetPendingTransactions();

    React.useEffect(() => {

        const pendingSessionIds = Object.keys(pendingTransactions) as string[];

        const newPendingSessionIds = pendingSessionIds
            .filter((sessionId: string) => !processedSessionIds.includes(sessionId))
            .filter((sessionId: string) => filter(sessionId, pendingTransactions, transactionFilter));

        for (const sessionId of newPendingSessionIds) {
            onNewPendingTrnasaction(sessionId);
        }

        setProcessedSessionIds([...processedSessionIds, ...newPendingSessionIds]);
    }, [pendingTransactions])

};

export default useGetOnNewPendingTransaction;

