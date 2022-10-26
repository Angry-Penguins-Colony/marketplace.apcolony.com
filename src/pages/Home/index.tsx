import * as React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { Link } from 'react-router-dom';
import APCLogoWhite from 'assets/img/apc-logo/white.png';
import CustomizationIcon from 'assets/img/customization.png';
import HeaderPenguin from 'assets/img/header-penguins.jpg';
import SellAndBuyPenguinExample from 'assets/img/sell_and_buy_penguin_example.png';
import Button from 'components/Abstract/Button/Button';
import { BigCategory } from 'components/Navigation/BigCategory/BigCategory';
import { CategoryItem } from 'components/Navigation/CategoryItem/CategoryItem';
import { GenericItemExplorer } from 'components/Navigation/GenericItemExplorer';
import { buildRouteLinks, routeNames } from 'routes';
import useGetExploreItems from 'sdk/hooks/api/useGetExploreItems';
import useGetItem from 'sdk/hooks/api/useGetItem';
import useGetOffers from 'sdk/hooks/api/useGetOffers';
import style from './index.module.scss';

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
          <Button className={style.button} type='primary' link={routeNames.unlock}>
            Connect your wallet
          </Button>
        }
      </section>
      <section className={style.categories}>
        <h2>Categories</h2>
        <div className={style.content}>
          <CategoryItem title="Hat" img="/img/icon/hat_big.png" link={buildRouteLinks.itemsOffers('hat')} />
          <CategoryItem title="Beak" img="/img/icon/hat_big.png" link={buildRouteLinks.itemsOffers('beak')} />
          <CategoryItem title="Skin" img="/img/icon/hat_big.png" link={buildRouteLinks.itemsOffers('skin')} />
          <CategoryItem title="Weapon" img="/img/icon/hat_big.png" link={buildRouteLinks.itemsOffers('weapon')} />
          <CategoryItem title="Background" img="/img/icon/hat_big.png" link={buildRouteLinks.itemsOffers('background')} />
          <CategoryItem title="Eyes" img="/img/icon/hat_big.png" link={buildRouteLinks.itemsOffers('eyes')} />
          <CategoryItem title="Clothes" img="/img/icon/hat_big.png" link={buildRouteLinks.itemsOffers('clothes')} />
        </div>
      </section>
      <section className={style['chose-category']}>
        <div className={style.content}>
          <BigCategory title="Penguins" backgroundImg={HeaderPenguin} link={routeNames.penguinsOffers} />
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
                  thumbnail={item.thumbnailUrls.high}
                  name={item.name}
                  link={buildRouteLinks.inspect(item.type, item.id)}
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
        <Button type='normal' link={buildRouteLinks.customize(1)} className={style.button}>Customize</Button>
      </section>
      <div className={style['global-unique-style']}>
        <section className={style['give-unique-style']}>
          <h2>Give your Angry Penguins<span><br /></span> gang a unique style</h2>
          <Link to={buildRouteLinks.itemsOffers('weapon')}>
            <Button type='normal' className={style.button}>Buy weapons</Button>
          </Link>
        </section>
        {
          highlightedItem && (
            <Link className={style['highlighted-item']} to={buildRouteLinks.inspect('items', HIGHLIGHTED_ITEM_ID)}>
              <section>
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
                <img className="w-100" src={highlightedItem.renderUrls.high} alt={highlightedItem.name} />
              </section>
            </Link>
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