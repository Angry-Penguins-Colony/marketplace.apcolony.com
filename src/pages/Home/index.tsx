import * as React from 'react';
import Button from 'components/Button/Button';
import { BigCategory } from './BigCategory';
import { CategoryItem } from './CategoryItem';
import style from './home.module.scss';
import { ItemOrPenguininExplorer } from './ItemOrPenguininExplorer';

interface ItemOrPenguin {
  id: string;
  thumbnail: string;
  name: string;
  price: number;
  count: number;
}

const Home = () => {
  const [exploreItems, setExploreItems] = React.useState<ItemOrPenguin[]>([]);
  const [highlightedItem, setHighlightedItem] = React.useState<ItemOrPenguin | undefined>(undefined);

  React.useEffect(() => {
    // simulate API call
    setTimeout(() => {
      setExploreItems([
        {
          id: '1',
          thumbnail: 'https://media.elrond.com/nfts/asset/QmcWbrFLTHN6DTTHdcwJPoVikk5htHBdB3eEB5EJ4eN8nU',
          name: 'Penguin #0155',
          price: 5,
          count: 1
        },
        {
          id: '2',
          thumbnail: 'https://apc.mypinata.cloud/ipfs/QmXWgGiuJrQmny1DPuwqqGyhewK2nDz1V5MUvVyJsBy2Vd',
          name: 'Captain\s cap',
          price: 1.2,
          count: 15
        },
        {
          id: '3',
          thumbnail: 'https://apc.mypinata.cloud/ipfs/QmckAEkwJuLv2FEvoXjpvpjtBaMxDxv2YT3CTTSYhwp2WS',
          name: 'beak spe',
          price: 3.5,
          count: 1
        },
        {
          id: '4',
          thumbnail: 'https://media.elrond.com/nfts/asset/QmcWbrFLTHN6DTTHdcwJPoVikk5htHBdB3eEB5EJ4eN8nU',
          name: 'Penguin #0155',
          price: 5,
          count: 1
        },
        {
          id: '5',
          thumbnail: 'https://apc.mypinata.cloud/ipfs/QmXWgGiuJrQmny1DPuwqqGyhewK2nDz1V5MUvVyJsBy2Vd',
          name: 'Captain\s cap',
          price: 1.2,
          count: 15
        },
        {
          id: '6',
          thumbnail: 'https://apc.mypinata.cloud/ipfs/QmckAEkwJuLv2FEvoXjpvpjtBaMxDxv2YT3CTTSYhwp2WS',
          name: 'beak spe',
          price: 3.5,
          count: 1
        },
        {
          id: '7',
          thumbnail: 'https://media.elrond.com/nfts/asset/QmcWbrFLTHN6DTTHdcwJPoVikk5htHBdB3eEB5EJ4eN8nU',
          name: 'Penguin #0155',
          price: 5,
          count: 1
        },
        {
          id: '8',
          thumbnail: 'https://apc.mypinata.cloud/ipfs/QmXWgGiuJrQmny1DPuwqqGyhewK2nDz1V5MUvVyJsBy2Vd',
          name: 'Captain\s cap',
          price: 1.2,
          count: 15
        }
      ]);

      setHighlightedItem({
        id: '1',
        thumbnail: 'https://apc.mypinata.cloud/ipfs/QmXD8TYrFydZZmt7SjKdccDZixLTHpVVrx3jbDs3afCUBu',
        name: 'Kimono With Red Belt',
        price: 2,
        count: 1
      });
    }, 1000);
  }
    , []);

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
          <CategoryItem title="Weapon" img="/img/icon/hat_big.png" link="TODO: add link" />
          <CategoryItem title="Weapon" img="/img/icon/hat_big.png" link="TODO: add link" />
          <CategoryItem title="Weapon" img="/img/icon/hat_big.png" link="TODO: add link" />
          <CategoryItem title="Weapon" img="/img/icon/hat_big.png" link="TODO: add link" />
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
      <section className={style['explore-all']}>
        <h2>Explore</h2>
        <div className={style.content}>
          {
            exploreItems.map(item => (
              <ItemOrPenguininExplorer
                key={item.id}
                thumbnail={item.thumbnail}
                name={item.name}
                price={item.price}
                count={item.count}
              // add click to open info of item
              />
            ))
          }
        </div>
        <div className={style.control}>
          <Button type='normal' className={style.button}>View all</Button>
        </div>
      </section>
      <section className={style['customize-your-penguins']}>
        <h2>Customize your<br />penguins !!!</h2>
        <p className={style.subtitle}>Make them unique with<br /> over a 100+ items</p>
        {/* TODO add image */}
        <Button type='normal' onClick={() => { window.location.href = '/customize'; }} className={style.button}>Customize</Button>
      </section>
      <div className={style['global-unique-style']}>
        <section className={style['give-unique-style']}>
          <h2>Give your Angry Penguins<span><br /></span> gang a unique style</h2>
          <Button type='normal' className={style.button}>Buy new items</Button>
        </section>
        {
          highlightedItem && (
            // TODO: add link to item
            <section className={style['highlighted-item']}>
              <div className={style.info}>
                <h2>Highlighted item</h2>
                <p className={style.name}>{highlightedItem.name}</p>
                <p className={style.price}>{highlightedItem.price} EGLD</p>
              </div>
              <img src={highlightedItem.thumbnail} alt={highlightedItem.name} />
            </section>
          )
        }
      </div>
      <section className={style['sell-items']}>
        {/* TODO: add style with specifics assets */}
        <h2>Sell items you earned<br />and buy new ones</h2>
        <p className={style.subtitle}>Buy and sell rare items on the marketplace<br />with the angry penguins community</p>
        <img src="/img/customization.png" alt="customization" className="penguin-example" />
        <Button className={style.button} onClick={() => {/* TODO: do onclik*/ }}>Sell item</Button>
        <Button className={style.button} onClick={() => {/* TODO: do onclik*/ }}>Buy items</Button>
      </section>
    </div>
  );
};

export default Home;