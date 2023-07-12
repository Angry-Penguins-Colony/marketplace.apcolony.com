import { Address } from '@multiversx/sdk-core/out';
import RetireOfferTransactionBuilder from './RetireOfferTransactionBuilder';

const address = Address.fromBech32('erd1qqqqqqqqqqqqqpgqrc4pg2xarca9z34njcxeur622qmfjp8w2jps89fxnl');

it('should build data', () => {
    const transaction = new RetireOfferTransactionBuilder()
        .setMarketplaceContract(address)
        .setAuctionId(10)
        .build();

    expect(transaction.data).toEqual('withdraw@0a');
})