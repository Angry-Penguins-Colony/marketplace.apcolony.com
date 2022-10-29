import React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { ButtonType } from 'components/Abstract/Button/Button';
import ConnectWalletButton from '../ConnectWalletButton';
import DisconnectWalletButton from '../DisconnectWalletButton';

export interface ILogButtonProps {
    className?: string;
    type?: ButtonType;
}

const LoginLogoutButton = (props: ILogButtonProps) => {

    const { address } = useGetAccountInfo();
    const isConnected = !!address;

    if (isConnected) {
        return <DisconnectWalletButton {...props} />

    }
    else {
        return <ConnectWalletButton {...props} />
    }

};

export default LoginLogoutButton;