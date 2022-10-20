import React from 'react'
import APCLogoWhite from 'assets/img/apc-logo/white.png';
import Button from 'components/Abstract/Button/Button';
import style from './index.module.scss';

export default function Staking() {
  return (
    <div id={style.launchpadVente}>
      <section className={style['top-page']}>
        <img src={APCLogoWhite} alt="" className="logo" />
        <h1>Welcome to one of the most <br /> important places of the <br /> Angry Penguins colony…</h1>
        <div className={style['cta']}>
          <p>Here is the place where you can Stake your Angry Penguins and receive the colony’s token!</p>
          <Button className={style.button} type='primary-outline'>STAKE</Button>
        </div>
      </section>
      
      <section className={style['rewards']}>

      </section>
    </div>

  )
}
