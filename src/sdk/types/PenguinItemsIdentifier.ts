import { IItem } from '@apcolony/marketplace-api';

export type PenguinItemsIdentifier = Record<string, string | undefined>;

export class Utils {
    static from(items: { [key: string]: Partial<IItem>; }): PenguinItemsIdentifier {
        const result: PenguinItemsIdentifier = {};
        for (const key in items) {
            result[key] = items[key].identifier;
        }
        return result;
    }

    static areEqual(a: PenguinItemsIdentifier, b: PenguinItemsIdentifier) {

        if (a.length != b.length) return false;

        const keys = mergeAndKeepUnique(Object.keys(a), Object.keys(b));

        for (const key of keys) {
            if (a[key] != b[key]) return false;
        }

        return true;
    }
}

function mergeAndKeepUnique<T>(a: T[], b: T[]) {
    return Array.from(new Set([...a, ...b]));
}