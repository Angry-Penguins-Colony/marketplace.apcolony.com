import React from 'react';
import Button from 'components/Abstract/Button/Button';
import { routeNames } from 'routes';
import { ILogButtonProps } from '../LoginLogoutButton';


const ConnectWalletButton = ({ className: btnClassName = '', type = 'primary' }: ILogButtonProps) => {


    return <Button link={routeNames.unlock} type={type} className={btnClassName}>
        Connect Wallet
    </Button>
};

export default ConnectWalletButton;