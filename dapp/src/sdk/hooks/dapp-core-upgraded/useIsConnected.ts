import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

function useIsConnected(): boolean {
    const { address } = useGetAccountInfo();
    return !!address;
}

export default useIsConnected;