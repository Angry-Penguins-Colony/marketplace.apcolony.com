import { IPenguin } from '@apcolony/marketplace-api';
import useGenericAPICall from './useGenericAPICall';

export function useGetStakingClaimable(address: string) {
    return useGenericAPICall(`/staking/claimable/${address}`);
}

export function useGetPenguinsStaked(address: string) {
    return useGenericAPICall(`/staking/owned/${address}`);
}

