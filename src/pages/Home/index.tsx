import * as React from 'react';
import Button from 'components/Button/Button';
import { BigCategory } from './BigCategory';
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
      <section className={style['chose-category']}>
        <h2>Chose a category</h2>
        <div className={style.content}>
          <BigCategory title="Penguins" backgroundImg="/img/penguin_category.png" link="TODO: add link" />
          <BigCategory title="Eggs" backgroundImg="/img/eggs_category.png" link="TODO: add link" />
          <BigCategory title="Items" backgroundImg="/img/items_category.png" link="TODO: add link" />
        </div>
      </section>
    </div>
  );
};

export default Home;