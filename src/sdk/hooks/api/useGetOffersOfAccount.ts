import { IAddress, IItem, IOffer, IPenguin } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';

interface Output {
    offers: IOffer[],
    associatedItems: IItem[]
    associatedPenguins: IPenguin[]
}

function useGetOffersOfAccount(address: IAddress) {

    return useGenericAPICall<Output>(`/offers/${address.bech32()}`);
}

export default useGetOffersOfAccount;