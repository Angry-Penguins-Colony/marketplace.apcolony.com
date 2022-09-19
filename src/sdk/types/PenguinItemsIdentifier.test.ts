import { PenguinItemsIdentifier, Utils } from './PenguinItemsIdentifier';

describe('areEquals', () => {
    it('equals in same order', () => {
        const a: PenguinItemsIdentifier = {
            'background': 'BG-1',
            'hat': 'HAT-1',
        };
        const b: PenguinItemsIdentifier = {
            'background': 'BG-1',
            'hat': 'HAT-1',
        };

        expect(Utils.areEqual(a, b)).toBeTruthy();
    });

    it('equals in different order', () => {
        const a: PenguinItemsIdentifier = {
            'background': 'BG-1',
            'hat': 'HAT-1',
        };
        const b: PenguinItemsIdentifier = {
            'hat': 'HAT-1',
            'background': 'BG-1',
        };

        expect(Utils.areEqual(a, b)).toBeTruthy();
    });

    it('not equals - different keys', () => {
        const a: PenguinItemsIdentifier = {
            'hat': 'HAT-1',
            'background': 'BG-1',
        };
        const b: PenguinItemsIdentifier = {
            'hat': 'HAT-1',
            'face': 'FACE-1',
        };

        expect(Utils.areEqual(a, b)).toBeFalsy();
    });

    it('not equals - different values', () => {
        const a: PenguinItemsIdentifier = {
            'background': 'BG-1',
            'hat': 'HAT-1',
        };
        const b: PenguinItemsIdentifier = {
            'background': 'BG-1',
            'hat': 'HAT-2',
        };

        expect(Utils.areEqual(a, b)).toBeFalsy();
    });
})