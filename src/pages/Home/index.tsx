import * as React from 'react';
import Button from 'components/Abstract/Button/Button';
import { BigCategory } from 'components/Navigation/BigCategory/BigCategory';
import { CategoryItem } from 'components/Navigation/CategoryItem/CategoryItem';
import { ItemOrPenguininExplorer } from 'components/Navigation/ItemOrPenguininExplorer/ItemOrPenguininExplorer';
import { buildRouteLinks, routeNames } from 'routes';
import CategoriesType from 'sdk/types/CategoriesType';
import style from './index.module.scss';

interface ItemOrPenguin {
  id: string;
  type: CategoriesType;
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
          type: 'penguins',
          thumbnail: 'https://media.elrond.com/nfts/asset/QmcWbrFLTHN6DTTHdcwJPoVikk5htHBdB3eEB5EJ4eN8nU',
          name: 'Penguin #0155',
          price: 5,
          count: 1
        },
        {
          id: '2',
          type: 'items',
          thumbnail: 'https://apc.mypinata.cloud/ipfs/QmXWgGiuJrQmny1DPuwqqGyhewK2nDz1V5MUvVyJsBy2Vd',
          name: 'Captain\s cap',
          price: 1.2,
          count: 15
        },
        {
          id: '3',
          type: 'items',
          thumbnail: 'https://apc.mypinata.cloud/ipfs/QmckAEkwJuLv2FEvoXjpvpjtBaMxDxv2YT3CTTSYhwp2WS',
          name: 'beak spe',
          price: 3.5,
          count: 1
        },
        {
          id: '4',
          type: 'penguins',
          thumbnail: 'https://media.elrond.com/nfts/asset/QmcWbrFLTHN6DTTHdcwJPoVikk5htHBdB3eEB5EJ4eN8nU',
          name: 'Penguin #0155',
          price: 5,
          count: 1
        },
        {
          id: '5',
          type: 'items',
          thumbnail: 'https://apc.mypinata.cloud/ipfs/QmXWgGiuJrQmny1DPuwqqGyhewK2nDz1V5MUvVyJsBy2Vd',
          name: 'Captain\s cap',
          price: 1.2,
          count: 15
        },
        {
          id: '6',
          type: 'items',
          thumbnail: 'https://apc.mypinata.cloud/ipfs/QmckAEkwJuLv2FEvoXjpvpjtBaMxDxv2YT3CTTSYhwp2WS',
          name: 'beak spe',
          price: 3.5,
          count: 1
        },
        {
          id: '7',
          type: 'penguins',
          thumbnail: 'https://media.elrond.com/nfts/asset/QmcWbrFLTHN6DTTHdcwJPoVikk5htHBdB3eEB5EJ4eN8nU',
          name: 'Penguin #0155',
          price: 5,
          count: 1
        },
        {
          id: '8',
          type: 'items',
          thumbnail: 'https://apc.mypinata.cloud/ipfs/QmXWgGiuJrQmny1DPuwqqGyhewK2nDz1V5MUvVyJsBy2Vd',
          name: 'Captain\s cap',
          price: 1.2,
          count: 15
        }
      ]);

      setHighlightedItem({
        id: '1',
        type: 'items',
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
        <Button className={style.button} type='primary' onClick={() => {
          window.location.href = routeNames.unlock;
        }}>Connect your wallet</Button>
      </section>
      <section className={style.categories}>
        <h2>Categories</h2>
        <div className={style.content}>
          <CategoryItem title="Hat" img="/img/icon/hat_big.png" link={buildRouteLinks.categoriesOffers('hat')} />
          <CategoryItem title="Beak" img="/img/icon/hat_big.png" link={buildRouteLinks.categoriesOffers('beak')} />
          <CategoryItem title="Skin" img="/img/icon/hat_big.png" link={buildRouteLinks.categoriesOffers('skin')} />
          <CategoryItem title="Weapon" img="/img/icon/hat_big.png" link={buildRouteLinks.categoriesOffers('weapon')} />
          <CategoryItem title="Background" img="/img/icon/hat_big.png" link={buildRouteLinks.categoriesOffers('background')} />
          <CategoryItem title="Eyes" img="/img/icon/hat_big.png" link={buildRouteLinks.categoriesOffers('eyes')} />
          <CategoryItem title="Clothes" img="/img/icon/hat_big.png" link={buildRouteLinks.categoriesOffers('clothes')} />
        </div>
      </section>
      <section className={style['chose-category']}>
        <h2>Chose a category</h2>
        <div className={style.content}>
          <BigCategory title="Penguins" backgroundImg="/img/penguin_category.png" link={buildRouteLinks.categoriesOffers('penguins')} />
          <BigCategory title="Eggs" backgroundImg="/img/eggs_category.png" link={buildRouteLinks.categoriesOffers('eggs')} />
          <BigCategory title="Items" backgroundImg="/img/items_category.png" link={buildRouteLinks.categoriesOffers('items')} />
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
                onClick={() => {
                  window.location.href = buildRouteLinks.inspect(item.type, item.id);
                }}
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
        <img src="/img/customization.png" alt="customization" />
        <Button type='normal' onClick={() => { window.location.href = routeNames.customize; }} className={style.button}>Customize</Button>
      </section>
      <div className={style['global-unique-style']}>
        <section className={style['give-unique-style']}>
          <h2>Give your Angry Penguins<span><br /></span> gang a unique style</h2>
          <Button type='normal' className={style.button}>Buy new items</Button>
        </section>
        {
          highlightedItem && (
            // TODO: add link to item
            <section className={style['highlighted-item']} onClick={() => { window.location.href = buildRouteLinks.inspect(highlightedItem.type, highlightedItem.id) }}>
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
        <img src="/img/sell_and_buy_penguin_example.png" alt="customization" className="penguin-example" />
        <Button className={style.button + ' ' + style.sell} onClick={() => {/* TODO: do onclik*/ }}>Sell item</Button>
        <Button className={style.button + ' ' + style.buy} onClick={() => {/* TODO: do onclik*/ }}>Buy items</Button>
      </section>
    </div>
  );
};

export default Home;