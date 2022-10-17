import React from 'react';
import Button from 'components/Abstract/Button/Button';
import { routeNames } from 'routes';
import { ILogButtonProps } from '../LoginLogoutButton';


const LoginButton = ({ btnClassName = '', type = 'primary' }: ILogButtonProps) => {


    return <Button type={type} className={btnClassName} onClick={() => {
        window.location.href = routeNames.unlock;
    }}>
        Connect Wallet
    </Button>
};

export default LoginButton;