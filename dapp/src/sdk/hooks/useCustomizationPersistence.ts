import ItemsDatabase from '@apcolony/db-marketplace/out/ItemsDatabase';
import { PenguinItemsIdentifier } from 'sdk/types/PenguinItemsIdentifier';

function useCustomizationPersistence(penguinId: string, itemsDatabase: ItemsDatabase) {

    const storageKey = `penguin-${penguinId}`;

    return {
        load,
        save
    }

    function load(): PenguinItemsIdentifier | undefined {
        const saved = localStorage.getItem(storageKey);

        if (saved) {
            const parsed = JSON.parse(saved);
            const corrupted = clearIfCorrupted(parsed);

            if (corrupted) {
                return undefined;
            }
            else {
                return parsed;
            }
        }

        return undefined;
    }

    function save(items: PenguinItemsIdentifier) {

        console.log(`Saving penguin with nonce ${penguinId}.`);

        localStorage.setItem(storageKey, JSON.stringify(items));
    }

    function clear() {
        localStorage.removeItem(storageKey);
    }

    function clearIfCorrupted(parsed: any): boolean {
        for (const slot in parsed) {
            const identifier = parsed[slot];

            if (identifier) {
                const item = itemsDatabase.getItemFromIdentifier(identifier);

                if (!item) {
                    console.warn(`Unknow identifier "${identifier}". Clearing save.`);
                    clear();
                    return true;
                }
            }
        }

        return false;
    }
}

export default useCustomizationPersistence;