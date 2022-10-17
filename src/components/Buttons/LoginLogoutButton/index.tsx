import React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { ButtonType } from 'components/Abstract/Button/Button';
import LoginButton from '../LoginButton/LoginButton';
import LogoutButton from '../LogoutButton';

export interface ILogButtonProps {
    btnClassName?: string;
    type?: ButtonType;
}

const LoginLogoutButton = (props: ILogButtonProps) => {

    const { address } = useGetAccountInfo();
    const isConnected = !!address;

    if (isConnected) {
        return <LogoutButton {...props} />

    }
    else {
        return <LoginButton {...props} />
    }

};

export default LoginLogoutButton;