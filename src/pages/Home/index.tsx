import * as React from 'react';
import Button from 'components/Button/Button';
import { CategoryItem } from './CategoryItem';
import style from './home.module.scss';

const Home = () => {
  return (
    <div id={style.home}>
      <section className={style['top-page']}>
        <img src="/img/logo/logo-white.png" alt="" className="logo" />
        <div className={style.info}>
          <h1>The market<br />place is here !</h1>
          <p>Customize, share, sell,<br />
            buy items you ever wanted !</p>
        </div>
        <Button className={style.button} type='primary'>Connect your wallet</Button>
      </section>
      <section className={style.categories}>
        <h2>Categories</h2>
        <div className={style.content}>
          <CategoryItem title="Hats" img="/img/icon/hat_big.png" link="TODO: add link" />
          <CategoryItem title="Beak" img="/img/icon/hat_big.png" link="TODO: add link" />
          <CategoryItem title="Skin" img="/img/icon/hat_big.png" link="TODO: add link" />
          <CategoryItem title="Weapon" img="/img/icon/hat_big.png" link="TODO: add link" />
        </div>
      </section>
    </div>
  );
};

export default Home;