import { IGenericElement, IPenguin } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';

export function useGetStakingClaimable(address: string) {   
    return useGenericAPICall(`/staking/claimable/${address}`);
}

export function useGetPenguinsStaked(address: string) {
    const raw = useGenericAPICall<IGenericElement>(`/staking/owned/${address}`);
    return raw;
}

export function useGetPenguinsUnstaked(address: string) {
    const raw = useGenericAPICall<IGenericElement>(`/penguins/owned/${address}`);
    return raw;
}

export function useGetTokensGenerated() {
    return useGenericAPICall('/staking/tokensGenerated/');
}
