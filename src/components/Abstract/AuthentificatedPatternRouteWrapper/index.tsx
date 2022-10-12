import React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { safeRedirect } from '@elrondnetwork/dapp-core/utils';

interface Props {
    children: React.ReactNode;
    unlockRoute: string;
}

/**
 * AuthenticatedRoutesWrapper but only for children and works with patterns (eg. /customize/:id) 
 */
const AuthentificatedPatternRouteWrapper = ({ children, unlockRoute }: Props) => {
    const { address } = useGetAccountInfo();
    const isLoggedIn = !address;

    if (isLoggedIn) {
        safeRedirect(unlockRoute);
        return null;
    }

    return <>{children}</>;
};

export default AuthentificatedPatternRouteWrapper;