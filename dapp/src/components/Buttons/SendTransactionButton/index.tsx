import React from 'react';
import { useTimer } from 'react-timer-hook';
import Button from 'components/Abstract/Button/Button';
import useIsConnected from 'sdk/hooks/dapp-core-upgraded/useIsConnected';
import ConnectWalletButton from '../ConnectWalletButton';

export interface ISendTransactionButtonProps {
    sendBtnLabel: string;
    onSend: () => void;
    unlockTimestamp?: number
    className?: string;
}

const SendTransactionButton = ({
    sendBtnLabel,
    onSend,
    unlockTimestamp,
    className
}: ISendTransactionButtonProps) => {

    const isConnected = useIsConnected();

    const {
        seconds,
        minutes,
        hours,
        days,
    } = useTimer({ expiryTimestamp: new Date(unlockTimestamp ?? 0) });


    if (!isConnected) {
        return <ConnectWalletButton className={className} />;
    }
    else if (unlockTimestamp && unlockTimestamp > Date.now()) {
        return <Button onClick={onSend} type='primary' disabled className={className}>
            {days}d {hours}h {minutes}m {seconds}s
        </Button>
    }
    else {
        return <Button onClick={onSend} type='primary' className={className}>
            {sendBtnLabel}
        </Button>
    }
};

export default SendTransactionButton;