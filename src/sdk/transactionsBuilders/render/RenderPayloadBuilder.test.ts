import { Attributes } from '@apcolony/marketplace-api';
import { RenderPayloadBuilder } from './RenderPayloadBuilder';

it('build correctly', () => {

    const expectedAttributes = 'Clothes:Clothes Joker-vest;Weapon:Weapon Flamethrower;Background:Background 3;Beak:Beak Dagger;Hat:Hat Headscarf-pirate-bitcoin;Eyes:unequipped;Skin:unequipped';
    const actual = new RenderPayloadBuilder()
        .setAttributes(new Attributes({
            'Clothes': 'Clothes Joker-vest',
            'Weapon': 'Weapon Flamethrower',
            'Background': 'Background 3',
            'Beak': 'Beak Dagger',
            'Hat': 'Hat Headscarf-pirate-bitcoin'
        }))
        .build();

    const expected = 'renderImage@' + Buffer.from(expectedAttributes).toString('hex');

    expect(actual.toString())
        .toEqual(expected);
});