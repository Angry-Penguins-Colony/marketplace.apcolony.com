import React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { logout } from '@elrondnetwork/dapp-core/utils';
import Button, { ButtonType } from 'components/Abstract/Button/Button';
import { routeNames } from 'routes';

interface Props {
    btnClassName?: string;
    type?: ButtonType;
}

const LoginButton = ({ btnClassName = '', type = 'primary' }: Props) => {

    const { address } = useGetAccountInfo();
    const isConnected = !!address;

    const handleLogout = () => {
        logout(`${window.location.origin}/unlock`);
    };

    if (isConnected) {
        return <Button type={type} className={btnClassName} onClick={handleLogout}>
            Disconnect {'...' + address?.slice(-4)}
        </Button>;

    }
    else {
        return <Button type={type} className={btnClassName} onClick={() => {
            window.location.href = routeNames.unlock;
        }}>
            Connect Wallet
        </Button>
    }

};

export default LoginButton;