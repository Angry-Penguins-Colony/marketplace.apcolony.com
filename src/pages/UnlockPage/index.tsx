import React from 'react';
import { useGetLoginInfo } from '@elrondnetwork/dapp-core/hooks';
import Popup from 'components/Foreground/Popup/Generic/Popup';
import { routeNames } from 'routes';
import ElrondLogo from './../../assets/img/icons/Elrond_logo.png';
import LedgerLogo from './../../assets/img/icons/Ledger_logo.png';
import MaiarLogo from './../../assets/img/icons/Maiar_logo.png';
import walletImg from './../../assets/img/wallet.png';
import style from './unlock.module.scss';

export const UnlockRoute: () => JSX.Element = () => {
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
        closePopup={() => {
          window.location.href = routeNames.home;
        }}>
        <h1>Connect Wallet</h1>
        <p className={style.desc}>Choose one of the available wallet providers or create a new wallet</p>
        {/* TODO: bind buttons */}
        <div className={style.action}>
          <div className={style.icon}>
            <img src={MaiarLogo} />
          </div>
          <p>Maiar</p>
        </div>
        <div className={style.action}>
          <div className={style.icon}>
            <img src={ElrondLogo} />
          </div>
          <p>Web wallet</p>
        </div>
        <div className={style.action}>
          <div className={style.icon}>
            <img src={LedgerLogo} />
          </div>
          <p>Ledger</p>
        </div>
        <div className={style.action}>
          <div className={style.icon}>
            <img src={ElrondLogo} />
          </div>
          <p>Extension</p>
        </div>
      </Popup>
    </div>
  );
};

export default UnlockRoute;
