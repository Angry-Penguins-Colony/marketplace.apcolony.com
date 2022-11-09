import { IOwnedItem, IPenguin } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import useGenericAPICall from './useGenericAPICall';

interface Output {
    penguins: IPenguin[];
    items: IOwnedItem[];
}

function useGetUserOwnedAmount(): Output | undefined {
    const { address } = useGetAccountInfo();
    const { data } = useGenericAPICall<Output>('owned/' + address);

    return data;
}

export default useGetUserOwnedAmount;