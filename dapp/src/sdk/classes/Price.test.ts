import BigNumber from 'bignumber.js';
import Price from './Price'

it('toEGLDDenomination', () => {
    expect(new Price(new BigNumber('1e18'), 18).toDenomination()).toStrictEqual('1');
})