import React from 'react';
import { useExtensionLogin, useGetLoginInfo, useWebWalletLogin } from '@elrondnetwork/dapp-core/hooks';
import { LedgerLoginContainer, WalletConnectLoginContainer } from '@elrondnetwork/dapp-core/UI';
import Popup from 'components/Foreground/Popup/Generic/Popup';
import { routeNames } from 'routes';
import ElrondLogo from './../../assets/img/icons/Elrond_logo.png';
import LedgerLogo from './../../assets/img/icons/Ledger_logo.png';
import MaiarLogo from './../../assets/img/icons/Maiar_logo.png';
import walletImg from './../../assets/img/wallet.png';
import style from './unlock.module.scss';

interface UnlockRouteProps {
  loginRoute: string;
}

enum State {
  LoginButtons,
  WalletConnect,
  Ledger,
}

export const UnlockRoute = ({ loginRoute }: UnlockRouteProps) => {

  const [state, setState] = React.useState(State.LoginButtons);

  const { isLoggedIn } = useGetLoginInfo();

  React.useEffect(() => {
    if (isLoggedIn) {
      window.location.href = routeNames.home;
    }
  }, [isLoggedIn]);

  return (
    <div className={style.unlock}>
      <Popup isVisible={true} haveCloseButton={true} className={style.popup}
        topIcon={
          <img src={walletImg} />
        }
        onCloseClicked={() => {
          window.location.href = routeNames.home;
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
          onLedgerClicked={() => setState(State.Ledger)}
        />;

      case State.WalletConnect:
        return <WalletConnectLoginContainer
          callbackRoute={loginRoute}
          loginButtonText={'Maiar App'}
          title={'Maiar  Loggin'}
          token={undefined}
          className={undefined}
          logoutRoute={routeNames.unlock}
          lead={'Scan the QR code using Maiar'}
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

export default UnlockRoute;

interface LoginButtonsProps {
  loginRoute: string;
  onMaiarClicked: () => void;
  onLedgerClicked: () => void;
}

const LoginButtons = ({ loginRoute, onMaiarClicked, onLedgerClicked }: LoginButtonsProps) => {



  return <>
    <h1>Connect Wallet</h1>
    <p className={style.desc}>Choose one of the available wallet providers or create a new wallet</p>

    <LoginButton icon={MaiarLogo} onClick={onMaiarClicked} text="Maiar" />

    <WebWalletLoginButton loginRoute={loginRoute} />

    <ExtensionLoginButton loginRoute={loginRoute} />

    <LoginButton icon={LedgerLogo} onClick={onLedgerClicked} text="Ledger" />
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