export function formatPrice(price: string, maxCharacters: number): string {
    const separators = [',', '.']

    // leading zeros
    price = price.replace(/^0+/, '');

    if (price.length > maxCharacters) {
        price = price.slice(0, maxCharacters);
    }

    if (price.length == 0) {
        price = '0';
    }

    // if the first character is a separator, add a leading zero
    if (separators.includes(price[0])) {
        price = '0' + price;
    }

    return price;
}

export function stringIsFloat(str: string): boolean {

    const separators = [',', '.']

    // get separators in str
    const strSeparators = str.split('').filter(char => separators.includes(char));

    if (strSeparators.length > 1) {
        return false;
    }

    if (str.endsWith('.') || str.endsWith(',')) {
        str = str.slice(0, -1);
    }

    const regex = /^\d+([\,]\d+)*([\.]\d+)?$/;
    return regex.test(str);
}