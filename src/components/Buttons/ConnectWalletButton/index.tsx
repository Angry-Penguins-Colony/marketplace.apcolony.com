import React from 'react';
import Button from 'components/Abstract/Button/Button';
import UnlockModal from 'pages/UnlockModal';
import { routeNames } from 'routes';
import { ILogButtonProps } from '../LoginLogoutButton';


const ConnectWalletButton = ({ className: btnClassName = '', type = 'primary' }: ILogButtonProps) => {

    const [isUnlockModalVisible, setIsUnlockModalVisible] = React.useState(false);

    return <>
        <Button type={type} className={btnClassName} onClick={() => setIsUnlockModalVisible(true)}>
            Connect Wallet
        </Button>

        <UnlockModal
            loginRoute={routeNames.home}
            isVisible={isUnlockModalVisible}
            onCloseClicked={() => setIsUnlockModalVisible(false)}
        />

    </>;
};

export default ConnectWalletButton;