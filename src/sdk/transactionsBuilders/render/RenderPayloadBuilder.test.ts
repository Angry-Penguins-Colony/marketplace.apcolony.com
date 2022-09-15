import { Attributes } from '@apcolony/marketplace-api';
import { RenderPayloadBuilder } from './RenderPayloadBuilder';

it('build correctly', () => {

    const actual = new RenderPayloadBuilder()
        .setAttributes(new Attributes({
            'Clothes': 'Clothes Joker-vest',
            'Weapon': 'Weapon Flamethrower',
            'Background': 'Background 3',
            'Beak': 'Beak Dagger',
            'Hat': 'Hat Headscarf-pirate-bitcoin'
        }))
        .build();

    const expected = 'renderImage@436c6f746865733a436c6f74686573204a6f6b65722d766573743b576561706f6e3a576561706f6e20466c616d657468726f7765723b4261636b67726f756e643a4261636b67726f756e6420333b4265616b3a4265616b204461676765723b4861743a486174204865616473636172662d7069726174652d626974636f696e';

    expect(actual.toString())
        .toEqual(expected);
});