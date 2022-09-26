import * as React from 'react';
import Button from 'components/Abstract/Button/Button';
import { routeNames } from 'routes';
import lostPenguin from './../../assets/img/lost_penguin.svg';
import style from './error-page.module.scss';

const PageNotFound = () => {
  return (
    <div className={style['error-page']}>
      <div className={style.content}>
        <img src={lostPenguin} alt="Penguin is lost" />
        <h1>Error 404</h1>
        <p>Oops a problem just happened</p>
        <Button type='primary' onClick={() => {
          window.location.href = routeNames.home;
        }}>Back to website</Button>
      </div>
    </div>
  );
};

export default PageNotFound;
