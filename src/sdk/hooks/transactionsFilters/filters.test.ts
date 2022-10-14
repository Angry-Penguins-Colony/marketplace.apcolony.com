import { Attributes } from '@apcolony/marketplace-api';
import { CustomizeTransactionFilter, RenderTransactionFilter, RetireTransactionFilter, SellTransactionFilter } from './filters'

test('sell transaction', () => {
    const data = 'ESDTNFTTransfer@414245414b2d643166373263@01@01@000000000000000005004a5d9e7caaa3d601d59c4bea2337019348751181654c@61756374696f6e546f6b656e@0de0b6b3a7640000@0de0b6b3a7640000@b2d05e00@45474c44@@01';

    expect(new SellTransactionFilter().contains(data)).toBeTruthy();
    expect(new RetireTransactionFilter().contains(data)).toBeFalsy();
    expect(new RenderTransactionFilter(new Attributes({})).contains(data)).toBeFalsy();
    expect(new CustomizeTransactionFilter().contains(data)).toBeFalsy();
})

test('withdraw transaction', () => {
    const data = 'withdraw@0a';

    expect(new RetireTransactionFilter().contains(data)).toBeTruthy()
    expect(new SellTransactionFilter().contains(data)).toBeFalsy();
    expect(new RenderTransactionFilter(new Attributes({})).contains(data)).toBeFalsy();
    expect(new CustomizeTransactionFilter().contains(data)).toBeFalsy();
})

test('render image, returns true if contains attributes', () => {
    const data = 'renderImage@4261636B67726F756E643A426C7565204772616469656E743B436C6F746865733A477265656E205361696C6F72204A61636B6574';

    expect(new RenderTransactionFilter(new Attributes({
        'background': 'Blue Gradient',
        'clothes': 'Green Sailor Jacket'
    })).contains(data)).toBeTruthy();
    expect(new SellTransactionFilter().contains(data)).toBeFalsy();
    expect(new RetireTransactionFilter().contains(data)).toBeFalsy();
    expect(new CustomizeTransactionFilter().contains(data)).toBeFalsy();
})
test('render image, returns false if dont contians attributes', () => {
    const data = 'renderImage@4261636b67726f756e643a426c7565204772616469656e743b436c6f746865733a477265656e205361696c6f72204a61636b65743b4861743a50726f70656c6c6572204361703b536b696e3a4f696c205370696c6c3b576561706f6e3a53656120536865706865726420476166663b4265616b3a756e65717569707065643b457965733a756e6571756970706564';

    expect(new RenderTransactionFilter(new Attributes({
        'background': 'Blue Gradient',
        'clothes': 'Green Sailor Jacket'
    })).contains(data)).toBeFalsy();
    expect(new SellTransactionFilter().contains(data)).toBeFalsy();
    expect(new RetireTransactionFilter().contains(data)).toBeFalsy();
    expect(new CustomizeTransactionFilter().contains(data)).toBeFalsy();
})

test('customize', () => {
    const data = 'MultiESDTNFTTransfer@00000000000000000500e9ec2ae837358b153ee45a82bfe3c6a743115f9e7056@01@50454e4755494e532d306132633332@71@01@637573746f6d697a65@65796573@776561706f6e';

    expect(new CustomizeTransactionFilter().contains(data)).toBeTruthy();
    expect(new SellTransactionFilter().contains(data)).toBeFalsy();
    expect(new RetireTransactionFilter().contains(data)).toBeFalsy();
    expect(new RenderTransactionFilter(new Attributes({})).contains(data)).toBeFalsy();
});