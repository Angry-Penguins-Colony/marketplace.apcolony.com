import { IAddress, IEgg, IItem, IOffer, IPenguin } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';

interface Output {
    offers: IOffer[],
    associated: {

        items: IItem[]
        penguins: IPenguin[]
        eggs: IEgg[]
    }
}

function useGetOffersOfAccount(address: IAddress) {

    return useGenericAPICall<Output>(`/accounts/${address.bech32()}/offers`);
}

export default useGetOffersOfAccount;