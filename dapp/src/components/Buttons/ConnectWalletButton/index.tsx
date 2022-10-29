import React from 'react';
import { useLocation } from 'react-router-dom';
import Button from 'components/Abstract/Button/Button';
import UnlockModal from 'pages/UnlockModal';
import { ILogButtonProps } from '../LoginLogoutButton';


const ConnectWalletButton = ({ className: btnClassName = '', type = 'primary' }: ILogButtonProps) => {

    const [isUnlockModalVisible, setIsUnlockModalVisible] = React.useState(false);
    const location = useLocation();

    return <>
        <Button type={type} className={btnClassName} onClick={() => setIsUnlockModalVisible(true)}>
            Connect Wallet
        </Button>

        <UnlockModal
            loginRoute={location.pathname}
            isVisible={isUnlockModalVisible}
            onCloseClicked={() => setIsUnlockModalVisible(false)}
        />
    </>;
};

export default ConnectWalletButton;