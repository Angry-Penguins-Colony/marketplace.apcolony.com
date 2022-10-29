import { items } from 'config';

export function identifierToItem(identifier: string) {
    return items.find(i => i.identifier == identifier);
}