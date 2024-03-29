import React from 'react';
import { useExtensionLogin, useGetLoginInfo, useWebWalletLogin } from '@multiversx/sdk-dapp/hooks';
import { LedgerLoginContainer, WalletConnectLoginContainer } from '@multiversx/sdk-dapp/UI';
import { useNavigate } from 'react-router-dom';
import Popup from 'components/Foreground/Popup/Generic/Popup';
import { routeNames } from 'routes';
import { createModal } from 'sdk/misc/shorthands';
import ElrondLogo from './../../assets/img/icons/Elrond_logo.png';
import MaiarLogo from './../../assets/img/icons/Maiar_logo.png';
import walletImg from './../../assets/img/wallet.png';
import style from './unlock.module.scss';

interface Props {
  loginRoute: string;
  isVisible?: boolean;
  onCloseClicked?: () => void
}

enum State {
  LoginButtons,
  WalletConnect,
  Ledger,
}

export const UnlockModal = ({ loginRoute, isVisible = true, onCloseClicked }: Props) => {

  const [state, setState] = React.useState(State.LoginButtons);

  const { isLoggedIn } = useGetLoginInfo();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoggedIn) {
      navigate(routeNames.home);
    }
  }, [isLoggedIn]);


  return createModal(
    <div className={style.unlock}>
      <Popup isVisible={isVisible} haveCloseButton={true} className={style.popup}
        topIcon={
          <img src={walletImg} />
        }
        onCloseClicked={() => {
          if (onCloseClicked) {
            onCloseClicked();
          }
          else {
            navigate(routeNames.home);
          }
        }}>


        {getContent()}
      </Popup>
    </div>
  );

  function getContent() {
    switch (state) {
      case State.LoginButtons:
        return <LoginButtons
          loginRoute={loginRoute}
          onMaiarClicked={() => setState(State.WalletConnect)}
        />;

      case State.WalletConnect:
        return <WalletConnectLoginContainer
          callbackRoute={loginRoute}
          loginButtonText={'xPortal App'}
          title={'xPortal Login'}
          token={undefined}
          className={undefined}
          logoutRoute={routeNames.unlock}
          isWalletConnectV2={true}
          lead={'Scan the QR code using xPortal'}
          wrapContentInsideModal={false}
          onClose={() => { setState(State.LoginButtons) }}
        />

      case State.Ledger:
        return <LedgerLoginContainer
          callbackRoute={loginRoute}
          wrapContentInsideModal={false}
          onClose={() => { setState(State.LoginButtons) }}
        />

      default:
        throw new Error('Invalid state');
    }
  }
};

export default UnlockModal;

interface LoginButtonsProps {
  loginRoute: string;
  onMaiarClicked: () => void;
}

const LoginButtons = ({ loginRoute, onMaiarClicked }: LoginButtonsProps) => {



  return <>
    <h1>Connect Wallet</h1>
    <p className={style.desc}>Choose one of the available wallet providers or create a new wallet</p>

    <LoginButton icon={MaiarLogo} onClick={onMaiarClicked} text="xPortal" />

    <WebWalletLoginButton loginRoute={loginRoute} />

    <ExtensionLoginButton loginRoute={loginRoute} />
  </>
}

const WebWalletLoginButton = ({ loginRoute }: { loginRoute: string }) => {
  const [onInitiateLogin] = useWebWalletLogin({ callbackRoute: loginRoute });

  const handleLogin = () => {
    onInitiateLogin();
  };

  return <LoginButton
    icon={ElrondLogo}
    text={'Web wallet'}
    onClick={handleLogin}
  />;
}

const ExtensionLoginButton = ({ loginRoute }: { loginRoute: string }) => {

  const [onInitiateLogin] = useExtensionLogin({
    callbackRoute: loginRoute,
  });

  const isFirefox = navigator.userAgent.indexOf('Firefox') != -1;

  const handleLogin = () => {
    if ((window as any).elrondWallet) {
      onInitiateLogin();
    } else {
      const url = isFirefox
        ? 'https://addons.mozilla.org/en-US/firefox/addon/maiar-defi-wallet/'
        : 'https://chrome.google.com/webstore/detail/dngmlblcodfobpdpecaadgfbcggfjfnm?authuser=0&hl=en';

      const tab = window.open(url, '_blank');
      tab?.focus();
    }
  };

  return <div className={style.action} onClick={handleLogin}>
    <div className={style.icon}>
      <img src={ElrondLogo} />
    </div>
    <p>Maiar Extension</p>
  </div>;
}

interface LoginButtonProps {
  icon: string;
  onClick: () => void;
  text: string;
}

const LoginButton = ({ icon, onClick, text }: LoginButtonProps) => {
  return <div className={style.action} onClick={onClick}>
    <div className={style.icon}>
      <img src={icon} />
    </div>
    <p>{text}</p>
  </div>;
}