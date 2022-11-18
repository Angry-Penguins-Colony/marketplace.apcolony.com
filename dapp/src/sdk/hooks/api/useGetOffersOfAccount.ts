import { IAddress, IOffer, IOwnedEgg, IOwnedItem, IPenguin } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';

interface Output {
    offers: IOffer[],
    associated: {

        items: IOwnedItem[]
        penguins: IPenguin[]
        eggs: IOwnedEgg[]
    }
}

function useGetOffersOfAccount(address: IAddress) {

    return useGenericAPICall<Output>(`/accounts/${address.bech32()}/offers`);
}

export default useGetOffersOfAccount;