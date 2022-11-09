import { formatPrice, stringIsFloat } from './price';

describe('formatPrice', () => {
    it('set zero if empty', () => {
        expect(formatPrice('', 10)).toBe('0');
    })

    it('should remove leading zero', () => {
        expect(formatPrice('000', 10)).toBe('0');
    })

    it('should remove leading zero', () => {
        expect(formatPrice('00001', 10)).toBe('1');
    })

    it('should remove leading zero and keep comma', () => {
        expect(formatPrice('0000,1', 10)).toBe('0,1');
    })

    it('should keep trailing zero', () => {
        expect(formatPrice('0,1000', 10)).toBe('0,1000');
    })

    it('should trim price to max characters', () => {
        expect(formatPrice('1234567890', 3)).toBe('123');
    });
});

test('stringIsFloat', () => {
    expect(stringIsFloat('')).toBe(false);
    expect(stringIsFloat('0')).toBe(true);
    expect(stringIsFloat('0.')).toBe(true);
    expect(stringIsFloat('0.0')).toBe(true);
    expect(stringIsFloat('0,00')).toBe(true);
    expect(stringIsFloat('0,0')).toBe(true);
    expect(stringIsFloat('0,0.')).toBe(false);
    expect(stringIsFloat('0.0,')).toBe(false);
    expect(stringIsFloat('0.0.0')).toBe(false);
    expect(stringIsFloat('0ea')).toBe(false);
});