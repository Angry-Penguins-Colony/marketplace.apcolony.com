import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import useGenericAPICall from './useGenericAPICall';

interface Output {
    penguins: Record<string, number>;
    items: Record<string, number>;
}

function useGetUserOwnedAmount(): Output | undefined {
    const { address } = useGetAccountInfo();
    return useGenericAPICall('owned/' + address);
}

export default useGetUserOwnedAmount;