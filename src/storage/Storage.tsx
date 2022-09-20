import { PenguinItemsIdentifier } from 'sdk/types/PenguinItemsIdentifier';
import BooleanKey from './BooleanKey';

export default class Storage {

    public static openWipModal = new BooleanKey('apc-open-wip-modal', true);

    /**
     * Get and delete the items identifier from the session storage.
     */
    public static consumePenguinItemsIdentifiers(sessionId: string, penguinNonce: number): PenguinItemsIdentifier | undefined {
        const key = Storage.buildKey(sessionId, penguinNonce);
        const item = window.sessionStorage.getItem(key);

        if (item) {
            const itemsIdentifier = JSON.parse(item) as PenguinItemsIdentifier;
            // window.localStorage.removeItem(sessionId);
            return itemsIdentifier;
        }
    }

    public static setPenguinItemsIdentifiers(sessionId: string, penguinNonce: number, itemsIdentifier: PenguinItemsIdentifier): void {
        const key = Storage.buildKey(sessionId, penguinNonce);
        console.log('setPenguinItemsIdentifiers', key, itemsIdentifier);
        window.localStorage.setItem(key, JSON.stringify(itemsIdentifier));
    }

    private static buildKey(sessionId: string, penguinNonce: number): string {
        return sessionId + '-' + penguinNonce;
    }
}

