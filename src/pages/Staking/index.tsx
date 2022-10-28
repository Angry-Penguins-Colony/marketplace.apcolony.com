import React from 'react'
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import { refreshAccount } from '@elrondnetwork/dapp-core/utils';
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
import { stakingContract } from 'config';
import { buildRouteLinks } from 'routes';
import useGetExploreItems from 'sdk/hooks/api/useGetExploreItems';
import {useGetStakingClaimable, useGetPenguinsStaked, useGetTokensGenerated} from 'sdk/hooks/api/useGetStaking';
import ClaimTransactioNBuilder from 'sdk/transactionsBuilders/staking/ClaimTransactionBuilder';
import style from './index.module.scss';


export default function Staking() {
  const { address : connectedAddress } = useGetAccountInfo();
  const exploreItems = useGetExploreItems();
  const [isStakePopupVisible, setIsStakePopupVisible] = React.useState(false);
  const claimable : any = useGetStakingClaimable(connectedAddress).data; 
  const penguinsStaked : any = useGetPenguinsStaked(connectedAddress).data;  
  const penguinsStakedCount = penguinsStaked != undefined ? Object.keys(penguinsStaked).length : 0;
  const tokensGeneratedByTheColony : any = useGetTokensGenerated().data;
  const tokensGeneratedByTheColonyCount = tokensGeneratedByTheColony != undefined ? tokensGeneratedByTheColony.tokensGenerated : 0;

 
  const claimFunc = async () => {
    const claim = new ClaimTransactioNBuilder();
    claim.setStakingContract(stakingContract);
    const transaction = claim.build();

    await refreshAccount();        

    await sendTransactions({
        transactions: transaction,
        transactionDisplayInfo: {
            processingMessage: 'Staking...',
            errorMessage: 'An error has occured during staking.',
            successMessage: 'Penguin staked successfully.',
        },
        redirectAfterSign: false
    });
}

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
          <span>{claimable == undefined ? 0 : claimable.claimable } APC</span>
          <Button className={style.button} type='primary' onClick={() => claimFunc()}>CLAIM REWARDS</Button>
          <a href="">More infos <span>i</span></a>
        </div>

        <div className={style['staked']}>
          <img src={apcStakedImg} alt="APC staked" />
          <h2>APC STAKED</h2>
          <span>{penguinsStakedCount}/5555</span>
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
          {tokensGeneratedByTheColonyCount}
        </div>
      </section>

      <StakePopup isVisible={isStakePopupVisible} closeModal={() => setIsStakePopupVisible(false)} />
    </div>

  )
}
