import { iterablesSlots } from '@apcolony/marketplace-api';
import { useSearchParams } from 'react-router-dom';
import { PenguinItemsIdentifier, Utils } from 'sdk/types/PenguinItemsIdentifier';

function useCustomizationParams() {
    const [searchParams] = useSearchParams();

    return {
        parseAttributes,
        getSearchParamsWithAttributes
    }


    function parseAttributes(): PenguinItemsIdentifier | undefined {
        const identifiers: PenguinItemsIdentifier = {};

        for (const slot of iterablesSlots) {
            identifiers[slot] = searchParams.get(slot) ?? undefined;
        }

        if (Utils.areEqual(identifiers, {})) {
            return undefined;
        } else {
            return identifiers;
        }
    }

    function getSearchParamsWithAttributes(equippedItemsIdentifier: PenguinItemsIdentifier): URLSearchParams {

        const _searchParams = new URLSearchParams(searchParams);

        for (const slot in equippedItemsIdentifier) {

            const identifier = equippedItemsIdentifier[slot];

            if (identifier) {
                _searchParams.set(slot, identifier);
            } else {
                _searchParams.delete(slot);
            }
        }

        return _searchParams;
    }
}

export default useCustomizationParams;