import { IAddress, IEgg, IOwnedItem, IPenguin } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';

interface Output {
    penguins: IPenguin[];
    items: IOwnedItem[];
    eggs: IEgg[];
}

function useGetUserOwnedAmount(address: IAddress): Output | undefined {
    const { data } = useGenericAPICall<Output>('accounts/' + address.bech32() + '/owned');

    return data;
}

export default useGetUserOwnedAmount;