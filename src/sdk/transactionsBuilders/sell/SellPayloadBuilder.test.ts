import { Address } from '@elrondnetwork/erdjs/out';
import BigNumber from 'bignumber.js';
import { SellPayloadBuilder } from './SellPayloadBuilder';

const tokenId = {
    ascii: 'HAT-a1a1a1',
    hex: '4841542d613161316131',
}

const smartContract = {
    bech32: 'erd1qqqqqqqqqqqqqpgq705fxpfrjne0tl3ece0rrspykq88mynn4kxs2cg43s',
    hex: '00000000000000000500f3e893052394f2f5fe39c65e31c024b00e7d9273ad8d'
}

test('test', () => {
    const actual = new SellPayloadBuilder()
        .setToken(tokenId.ascii, 1)
        .setMarketplaceSc(Address.fromBech32(smartContract.bech32))
        .setPrice(new BigNumber('1e18'))
        .build();

    // example: https://explorer.elrond.com/transactions/b2b6a7975a38077e6c0ca121203121f8755db6cf584149e2c9ba65f7ded61b90#smart

    const expected = 'ESDTNFTTransfer'
        + '@' + tokenId.hex // token id
        + '@' + '01' // nonce
        + '@' + '01' // quantity
        + '@' + smartContract.hex // receiver
        + '@' + '61756374696f6e546f6b656e' // auctionToken
        + '@' + '0de0b6b3a7640000' // (min_bid) 1 EGLD
        + '@' + '0de0b6b3a7640000' // (max_bid) 1 EGLD
        + '@' + 'b2d05e00' // (deadline) 3_000_000_000
        + '@' + '45474c44' // (accepted_payment_token) EGLD
        + '@' + '' //  (opt_min_bid_diff) None
        + '@' + '01' // (opt_sft_max_one_per_payment) True

    expect(actual.toString()).toStrictEqual(expected);
})