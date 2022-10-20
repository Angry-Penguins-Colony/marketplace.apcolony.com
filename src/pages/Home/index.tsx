import * as React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { Link } from 'react-router-dom';
import APCLogoWhite from 'assets/img/apc-logo/white.png';
import Button from 'components/Abstract/Button/Button';
import { BigCategory } from 'components/Navigation/BigCategory/BigCategory';
import { CategoryItem } from 'components/Navigation/CategoryItem/CategoryItem';
import { GenericItemExplorer } from 'components/Navigation/GenericItemExplorer';
import { ipfsGateway } from 'config';
import { buildRouteLinks, routeNames } from 'routes';
import useGetExploreItems from 'sdk/hooks/api/useGetExploreItems';
import useGetItem from 'sdk/hooks/api/useGetItem';
import useGetOffers from 'sdk/hooks/api/useGetOffers';
import CustomizationIcon from './customization.png';
import HeaderPenguin from './header-penguins.jpg';
import style from './index.module.scss';
import SellAndBuyPenguinExample from './sell_and_buy_penguin_example.png';

const HIGHLIGHTED_ITEM_ID = '94';

const Home = () => {

  const { address } = useGetAccountInfo();
  const isConnected = !!address;

  const { data: highlightedItem } = useGetItem(HIGHLIGHTED_ITEM_ID);
  const exploreItems = useGetExploreItems();

  const { lowestBuyableOffer } = useGetOffers('items', HIGHLIGHTED_ITEM_ID);

  return (
    <div id={style.home}>
      <section className={style['top-page']}>
        <img src={APCLogoWhite} alt="" className="logo" />
        <div className={style.info}>
          <h1>The market<br />place is here !</h1>
          <p>Customize, share, sell,<br />
            buy items you ever wanted !</p>
        </div>
        {isConnected ?
          <p></p>
          :
          <Button className={style.button} type='primary' onClick={() => {
            window.location.href = routeNames.unlock;
          }}>Connect your wallet</Button>
        }
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
        <div className={style.content}>
          <BigCategory title="Penguins" backgroundImg={HeaderPenguin} link={buildRouteLinks.categoriesOffers('penguins')} />
        </div>
      </section>
      {
        exploreItems &&
        <section className={style['explore-all']}>
          <h2>Explore</h2>
          <div className={style.content}>
            {
              exploreItems.map(item => (
                <GenericItemExplorer
                  key={item.id}
                  thumbnail={ipfsGateway + item.thumbnailCID}
                  name={item.name}
                  onClick={() => {
                    window.location.href = buildRouteLinks.inspect(item.type, item.id);
                  }}
                />
              ))
            }
          </div>
        </section>
      }
      <section className={style['customize-your-penguins']}>
        <h2>Customize your<br />penguins !!!</h2>
        <p className={style.subtitle}>Make them unique with<br /> over a 100+ items</p>
        <img src={CustomizationIcon} alt="customization" />
        <Button type='normal' onClick={() => { window.location.href = buildRouteLinks.customize(1); }} className={style.button}>Customize</Button>
      </section>
      <div className={style['global-unique-style']}>
        <section className={style['give-unique-style']}>
          <h2>Give your Angry Penguins<span><br /></span> gang a unique style</h2>
          <Link to={buildRouteLinks.categoriesOffers('weapon')}>
            <Button type='normal' className={style.button}>Buy weapons</Button>
          </Link>
        </section>
        {
          highlightedItem && (
            <section className={style['highlighted-item']} onClick={() => { window.location.href = buildRouteLinks.inspect('items', HIGHLIGHTED_ITEM_ID) }}>
              <div className={style.info}>
                <h2>Highlighted item</h2>
                <p className={style.name}>{highlightedItem?.name ?? '--'}</p>
                <p className={style.price}>
                  {
                    (() => {
                      if (lowestBuyableOffer == null) {
                        return 'No offers';
                      }
                      else {
                        const price = lowestBuyableOffer?.price ?? '--';
                        return `${price} EGLD`;
                      }
                    })()
                  }
                </p>
              </div>
              <img src={ipfsGateway + highlightedItem.renderCID} alt={highlightedItem.name} />
            </section>
          )
        }
      </div>
      <section className={style['sell-items']}>
        <h2>Sell items you earned<br />and buy new ones</h2>
        <p className={style.subtitle}>Buy and sell rare items on the marketplace<br />with the angry penguins community</p>
        <img src={SellAndBuyPenguinExample} alt="customization" className="penguin-example" />
      </section>
    </div>
  );
};

export default Home;