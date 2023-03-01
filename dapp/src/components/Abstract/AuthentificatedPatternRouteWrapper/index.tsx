import React from 'react';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { safeRedirect } from '@multiversx/sdk-dapp/utils';

interface Props {
    children: React.ReactNode;
    unlockRoute: string;
}

/**
 * AuthenticatedRoutesWrapper but only for children and works with patterns (eg. /customize/:id) 
 * 
 * Updating @multiversx/sdk-dapp to 2.0.3 will make this component obsolete (but update cause troubles for the moment)
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