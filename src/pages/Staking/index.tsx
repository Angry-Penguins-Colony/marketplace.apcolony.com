import React from 'react'
import AccessoryIconBronze from 'assets/img/accessory_icon_bronze.png';
import AccessoryIconDiamond from 'assets/img/accessory_icon_diamond.png';
import AccessoryIconGold from 'assets/img/accessory_icon_gold.png';
import AccessoryIconSilver from 'assets/img/accessory_icon_silver.png';
import APCLogoWhite from 'assets/img/apc-logo/white.png';
import apCoinRewardsImg from 'assets/img/apc_coin_reward.png';
import apcStakedImg from 'assets/img/apc_staked.png';
import penguinAndStack from 'assets/img/penguin_and_stack.png';
import AccessoriesGeneration from 'components/Abstract/AccessoriesGeneration/AccessoriesGeneration';
import Button from 'components/Abstract/Button/Button';
import { GenericItemExplorer } from 'components/Navigation/GenericItemExplorer';
import { buildRouteLinks } from 'routes';
import useGetExploreItems from 'sdk/hooks/api/useGetExploreItems';
import style from './index.module.scss';


export default function Staking() {
  const exploreItems = useGetExploreItems();

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
        <div className={style['claim']} >
          <img src={apCoinRewardsImg} alt="APC coin" />
          <h2>REWARD TO CLAIM</h2>
          <span>150 APC</span>
          <Button className={style.button} type='primary'>CLAIM REWARDS</Button>
          <a href="">More infos <span>i</span></a>
        </div>

        <div className={style['staked']}>
          <img src={apcStakedImg} alt="APC staked" />
          <h2>APC STAKED</h2>
          <span>00001/5555</span>
        </div>
      </section>

      {
        exploreItems && exploreItems.length > 0 && (
          <section className={style['stake-list']}>
            <p>You have <span>{exploreItems.length}</span> angry penguins staked.</p>
            <div className={style.content}>
              {
                exploreItems?.map(item => (
                  <GenericItemExplorer
                    key={item.id}
                    thumbnail={item.thumbnailWebUri}
                    name={item.name}
                    onClick={() => {
                      window.location.href = buildRouteLinks.inspect(item.type, item.id);
                    }}
                  />
                ))
              }
            </div>
          </section>
        )
      }

      <section className={style['accessories']}>
        <div className={style.grid}>
          <h2><span>Each accessory</span> on your penguin <span>generates</span> a <span>certain amount of token</span> when it is deposited in staking.</h2>
          <div className={style['accessories-list']}>
            <AccessoriesGeneration rarity='Bronze' tokenGenerated={9999} img={AccessoryIconBronze} />
            <AccessoriesGeneration rarity='Silver' tokenGenerated={9999} img={AccessoryIconSilver} />
            <AccessoriesGeneration rarity='Gold' tokenGenerated={9999} img={AccessoryIconGold} />
            <AccessoriesGeneration rarity='Diamond' tokenGenerated={9999} img={AccessoryIconDiamond} />
          </div>
          <div className={style['img-container']}>
            <img src={penguinAndStack} alt="Penguin on APC stack" />
          </div>
        </div>
        <div>
          Test
        </div>

      </section>

      <section className={style['accessories']}>

      </section>

    </div>

  )
}
