import { PenguinItemsIdentifier } from 'sdk/types/PenguinItemsIdentifier';

function useCustomizationPersistence(selectedPenguinNonce: number) {

    const storageKey = `penguin-${selectedPenguinNonce}`;

    return {
        load,
        save
    }

    function load(): PenguinItemsIdentifier | undefined {
        console.log(`Loading penguin with nonce ${selectedPenguinNonce}.`);
        const saved = localStorage.getItem(storageKey);

        if (saved) {
            return JSON.parse(saved);
        }

        return undefined;
    }

    function save(items: PenguinItemsIdentifier) {

        console.log(`Saving penguin with nonce ${selectedPenguinNonce}.`);

        localStorage.setItem(storageKey, JSON.stringify(items));
    }
}

export default useCustomizationPersistence;