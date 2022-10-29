import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';

function useIsConnected(): boolean {
    const { address } = useGetAccountInfo();
    return !!address;
}

export default useIsConnected;