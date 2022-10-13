import { SignedTransactionsType } from '@elrondnetwork/dapp-core/types';

export default interface ITransactionFilter {
    contains: (data: string) => boolean;
}

export function filter(
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