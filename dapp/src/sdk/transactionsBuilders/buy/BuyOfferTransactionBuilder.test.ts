import { Address } from '@multiversx/sdk-core/out';
import BigNumber from 'bignumber.js';
import BuyOfferTransactionBuilder from './BuyOfferTransactionBuilder';

const address = Address.fromBech32('erd1qqqqqqqqqqqqqpgqrc4pg2xarca9z34njcxeur622qmfjp8w2jps89fxnl');

it('should build data', () => {
    const transaction = new BuyOfferTransactionBuilder()
        .setMarketplaceContract(address)
        .setOffer({
            id: 10,
            collection: 'HAT-a1a1a1',
            nonce: 1,
            price: '1'
        })
        .build();

    const expectedData = 'buySft'
        + '@' + '0a'
        + '@' + '4841542d613161316131' // token identier
        + '@' + '01'// nft_nonce

    expect(transaction.data).toEqual(expectedData);
    expect(transaction.value).toEqual(new BigNumber('1e18').toString());
    expect(transaction.receiver).toEqual(address.bech32());
})