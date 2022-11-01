import { Attributes } from '@apcolony/marketplace-api';
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

export class RenderTransactionFilter implements ITransactionFilter {

    constructor(
        private readonly attributes: Attributes
    ) { }

    contains(data: string): boolean {

        const [endpointName, encodedAttributes] = data.split('@');

        if (endpointName !== 'renderImage') return false;

        const decodedAttributes = Buffer.from(encodedAttributes, 'hex').toString('utf-8');

        return this.attributes.equals(Attributes.fromEndpointArgument(decodedAttributes));
    }
}

export class CustomizeTransactionFilter implements ITransactionFilter {
    contains(data: string): boolean {
        const endpointName = Buffer.from('customize', 'utf-8').toString('hex');
        return data.includes(endpointName);
    }
}