import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import useGenericAPICall from './useGenericAPICall';

interface Output {
    penguins: Record<string, number>;
    items: Record<string, number>;
}

function useGetUserOwnedAmount(): Output | undefined {
    const { address } = useGetAccountInfo();
    const { data } = useGenericAPICall<Output>('owned/' + address);

    return data;
}

export default useGetUserOwnedAmount;