import ITransactionFilter from './ITransactionFilter';

export class SellTransactionFilter implements ITransactionFilter {
    contains(data: string): boolean {
        const endpointName = Buffer.from('auctionToken', 'utf-8').toString('hex');
        return data.includes(endpointName);
    }
}

export class RetireTransactionFilter implements ITransactionFilter {
    contains(data: string): boolean {
        return data.includes('withdraw');
    }
}