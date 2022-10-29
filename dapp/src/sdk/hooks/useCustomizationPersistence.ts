import { PenguinItemsIdentifier } from 'sdk/types/PenguinItemsIdentifier';

function useCustomizationPersistence(penguinId: string) {

    const storageKey = `penguin-${penguinId}`;

    return {
        load,
        save
    }

    function load(): PenguinItemsIdentifier | undefined {
        console.log(`Loading penguin with nonce ${penguinId}.`);
        const saved = localStorage.getItem(storageKey);

        if (saved) {
            return JSON.parse(saved);
        }

        return undefined;
    }

    function save(items: PenguinItemsIdentifier) {

        console.log(`Saving penguin with nonce ${penguinId}.`);

        localStorage.setItem(storageKey, JSON.stringify(items));
    }
}

export default useCustomizationPersistence;