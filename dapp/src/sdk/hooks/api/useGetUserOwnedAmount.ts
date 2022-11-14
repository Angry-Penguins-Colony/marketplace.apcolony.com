import { IAddress, IOwnedItem, IPenguin } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';

interface Output {
    penguins: IPenguin[];
    items: IOwnedItem[];
}

function useGetUserOwnedAmount(address: IAddress): Output | undefined {
    const { data } = useGenericAPICall<Output>('owned/' + address.bech32());

    return data;
}

export default useGetUserOwnedAmount;