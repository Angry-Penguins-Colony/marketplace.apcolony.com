import React, { useEffect } from 'react'
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { Address, AddressValue } from '@elrondnetwork/erdjs/out';
import AccessoryIconBronze from 'assets/img/accessory_icon_bronze.png';
import AccessoryIconDiamond from 'assets/img/accessory_icon_diamond.png';
import AccessoryIconGold from 'assets/img/accessory_icon_gold.png';
import AccessoryIconSilver from 'assets/img/accessory_icon_silver.png';
import APCLogoWhite from 'assets/img/apc-logo/white.png';
import apCoinRewardsImg from 'assets/img/apc_coin_reward.png';
import apcStakedImg from 'assets/img/apc_staked.png';
import penguinAndStack from 'assets/img/penguin_and_stack.png';
import tokenGeneratedDesktop from 'assets/img/token_generated_desktop.png';
import tokenGeneratedMobile from 'assets/img/token_generated_mobile.png';
import AccessoriesExamples from 'components/Abstract/AccessoriesExamples/AccessoriesExamples';
import AccessoriesGeneration from 'components/Abstract/AccessoriesGeneration/AccessoriesGeneration';
import Button from 'components/Abstract/Button/Button';
import StakePopup from 'components/Foreground/Popup/StakePopup/StakePopup';
import { GenericItemExplorer } from 'components/Navigation/GenericItemExplorer';
import { buildRouteLinks } from 'routes';
import useGetExploreItems from 'sdk/hooks/api/useGetExploreItems';
import style from './index.module.scss';


export default function Staking() {
  const { address } = useGetAccountInfo();
  const exploreItems = useGetExploreItems();
  const [isStakePopupVisible, setIsStakePopupVisible] = React.useState(false);
  const [rewardsToClaim, setRewardsToClaim] = React.useState('');
  const [apcStaked, setApcStaked] = React.useState('');
  // const query = new QueryBuilder();

  const scAddress = 'erd1qqqqqqqqqqqqqpgqdcjdvpvncw7s8ug56rehyvl8tehk3vl368mqxa7llg'; //Todo : Change this function of the environment
  const apcToken = 'TEST-17e1db';//Todo : Change this function of the environment and the sdk ?
  const apcTokenInSc = 1000000;//Todo : Change this function of the environment and the sdk ?

  // useEffect(() => {
  //   const getNftsForStakerFunc = async () => {
  //     query.createQuery(
  //       address,
  //       scAddress,
  //       'getNftsNumberAndRewardsAvailableForStaker',
  //       [new AddressValue(new Address('erd1gsqegzjref54nv4hzjn9zhyze0g8us0tvm7fd5ph5z9z3tuqhzcq6g3503'))]
  //     ).then((response) => {
  //       const rewards = response.values[1].valueOf().toString();
  //       const staked = response.values[0].valueOf().toString();
  //       setRewardsToClaim(rewards);
  //       setApcStaked(staked);
  //     }).catch((error) => {
  //       //ToDop: handle error 
  //     })
  //   }
  //   getNftsForStakerFunc();
  // }, [])



  return (
    <div id={style.launchpadVente}>
      <section className={style['top-page']}>
        <img src={APCLogoWhite} alt="" className="logo" />
        <h1>Welcome to one of the most <br /> important places of the <br /> Angry Penguins colony…</h1>
        <div className={style['cta']}>
          <p>Here is the place where you can Stake <br />your Angry Penguins and receive the colony’s token!</p>
          <Button onClick={() => setIsStakePopupVisible(true)} className={style.button} type='primary-outline'>STAKE</Button>
        </div>
      </section>

      <section className={style['rewards']}>
        <div className={style['claim']} >
          <img src={apCoinRewardsImg} alt="APC coin" />
          <h2>REWARD TO CLAIM</h2>
          <span>{rewardsToClaim == '' ? 0 : rewardsToClaim} APC</span>
          <Button className={style.button} type='primary'>CLAIM REWARDS</Button>
          <a href="">More infos <span>i</span></a>
        </div>

        <div className={style['staked']}>
          <img src={apcStakedImg} alt="APC staked" />
          <h2>APC STAKED</h2>
          <span>{apcStaked == '' ? 0 : apcStaked}/5555</span>
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
                    thumbnail={item.thumbnailUrls.high}
                    name={item.name}
                    link={buildRouteLinks.inspect(item.type, item.id)}
                  />
                ))
              }
            </div>
          </section>
        )
      }

      <section className={style['accessories']}>
        <div className={style.grid}>
          <h2><span>Each accessory</span> on your penguin <br /><span>generates</span> a <span>certain amount <br />of token per day</span> when it is deposited <br />in staking.</h2>
          <div className={style['accessories-list']}>
            <AccessoriesGeneration rarity='Bronze' tokenGenerated={1} img={AccessoryIconBronze} />
            <AccessoriesGeneration rarity='Silver' tokenGenerated={2} img={AccessoryIconSilver} />
            <AccessoriesGeneration rarity='Gold' tokenGenerated={3} img={AccessoryIconGold} />
            <AccessoriesGeneration rarity='Diamond' tokenGenerated={4} img={AccessoryIconDiamond} />
          </div>
          <div className={style['img-container']}>
            <img src={penguinAndStack} alt="Penguin on APC stack" />
          </div>
        </div>
        <div>
          <AccessoriesExamples />
        </div>
      </section>

      <section className={style['token-generated']}>
        <div className={style['img-container']}>
          <img className={style.mobile} src={tokenGeneratedMobile} alt="Token generated" />
          <img className={style.desktop} src={tokenGeneratedDesktop} alt="Token generated" />
        </div>
        <div className={style.counter}>
          20000
        </div>
      </section>

      <StakePopup isVisible={isStakePopupVisible} closeModal={() => setIsStakePopupVisible(false)} />
    </div>

  )
}
