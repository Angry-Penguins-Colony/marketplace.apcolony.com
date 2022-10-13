import ITransactionFilter from './ITransactionFilter';

export default class SellTransactionFilter implements ITransactionFilter {
    contains(data: string): boolean {
        const endpointName = Buffer.from('auctionToken', 'utf-8').toString('hex');
        return data.includes(endpointName);
    }
}