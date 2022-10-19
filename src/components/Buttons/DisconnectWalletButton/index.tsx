import React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { logout } from '@elrondnetwork/dapp-core/utils';
import Button from 'components/Abstract/Button/Button';
import { ILogButtonProps } from '../LoginLogoutButton';


const DisconnectWalletButton = ({ className: btnClassName = '', type = 'primary' }: ILogButtonProps) => {

    const { address } = useGetAccountInfo();

    const handleLogout = () => {
        logout(`${window.location.origin}/unlock`);
    };

    return <Button type={type} className={btnClassName} onClick={handleLogout}>
        Disconnect {'...' + address?.slice(-4)}
    </Button>;

};

export default DisconnectWalletButton;