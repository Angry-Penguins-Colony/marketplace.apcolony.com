import React, { useEffect } from 'react'
import { IPenguin } from '@apcolony/marketplace-api';
import { useGetAccountInfo, useGetPendingTransactions, useTrackTransactionStatus } from '@elrondnetwork/dapp-core/hooks';
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
import { useGetStakingClaimable, useGetPenguinsStaked, useGetTokensGenerated, useGetPenguinsUnstaked } from 'sdk/hooks/api/useGetStaking';
import ClaimTransactioNBuilder from 'sdk/transactionsBuilders/staking/ClaimTransactionBuilder';
import style from './index.module.scss';


export default function Staking() {
  const { address: connectedAddress } = useGetAccountInfo();
  const [isStakePopupVisible, setIsStakePopupVisible] = React.useState(false);

  const { data: stakingClaimable, forceReload: reloadStakingClaimable } = useGetStakingClaimable(connectedAddress);
  const stakingClaimableData = stakingClaimable as any;

  const { data: penguinsStaked, forceReload: reloadPenguinsStaked } = useGetPenguinsStaked(connectedAddress);
  const { data: penguinsUnstaked, forceReload: reloadPenguinsUnstaked } = useGetPenguinsUnstaked(connectedAddress);
  const penguinsStakedArray = penguinsStaked as Array<IPenguin> | undefined;
  const penguinsUnstakedArray = penguinsUnstaked as Array<IPenguin> | undefined;

  const penguinsStakedCount = penguinsStakedArray != undefined ? penguinsStakedArray.length : 0;
  const { data: tokensGeneratedByTheColony, forceReload: reloadTokensGeneratedByTheColony } = useGetTokensGenerated();
  const tokensGeneratedByTheColonyData = tokensGeneratedByTheColony as any;



  const [transactionSessionId, setTransactionSessionId] = React.useState<string | null>(null);

  const { pendingTransactionsArray, hasPendingTransactions } =
    useGetPendingTransactions();

  useEffect(() => { //Web wallet support for handling reloads after a transaction
    if (hasPendingTransactions) {
      setTransactionSessionId(pendingTransactionsArray[0][0]);
    }
  }, [hasPendingTransactions]);


  const transactionStatus = useTrackTransactionStatus({
    transactionId: transactionSessionId,
    onSuccess: async () => {
      reloadPenguinsStaked();
      reloadPenguinsUnstaked();
      reloadStakingClaimable();
      reloadTokensGeneratedByTheColony();
    }
  });

  const claimFunc = async () => {
    const claim = new ClaimTransactioNBuilder();
    claim.setStakingContract(stakingContract);
    const transaction = claim.build();

    await refreshAccount();

    const { sessionId } = await sendTransactions({
      transactions: transaction,
      transactionDisplayInfo: {
        processingMessage: 'Staking...',
        errorMessage: 'An error has occured during staking.',
        successMessage: 'Penguin staked successfully.',
      },
      redirectAfterSign: false
    });

    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
  }

  return (
    <div id={style.launchpadVente}>
      <section className={style['top-page']}>
        <img src={APCLogoWhite} alt="" className="logo" />
        <h1>Welcome to one of the most <br /> important places of the <br /> Angry Penguins colony…</h1>
        <div className={style['cta']}>
          <p>Here is the place where you can Stake <br />your Angry Penguins and receive the colony’s token!</p>
          <Button onClick={() => setIsStakePopupVisible(true)} className={style.button} type='primary-outline'>STAKE / UNSTAKE</Button>
        </div>
      </section>

      <section className={style['rewards']}>
        <div className={style['claim']} >
          <img src={apCoinRewardsImg} alt="$ICE coin" />
          <h2>REWARD TO CLAIM</h2>
          <span>{stakingClaimableData == undefined ? 0 : stakingClaimableData.claimable} $ICE</span>
          <Button className={style.button} type='primary' onClick={() => claimFunc()}>CLAIM REWARDS</Button>
          <a href="">More infos <span>i</span></a>
        </div>

        <div className={style['staked']}>
          <img src={apcStakedImg} alt="$ICE staked" />
          <h2>$ICE STAKED</h2>
          <span>{penguinsStakedCount}/5555</span>
        </div>
      </section>

      {
        penguinsStakedArray && penguinsStakedArray.length > 0 && (
          <section className={style['stake-list']}>
            <p>You have <span>{penguinsStakedArray.length}</span> angry penguins staked.</p>
            <div className={style.content}>
              {
                penguinsStakedArray.map((item: any) => (
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
          <div>
            <h2><span>Each accessory</span> on your penguin <br /><span>generates</span> a <span>certain amount <br />of token per day</span> when it is deposited <br />in staking.</h2>
          </div>
          <div className={style['accessories-list']}>
            <AccessoriesGeneration rarity='Bronze' tokenGenerated={1} img={AccessoryIconBronze} />
            <AccessoriesGeneration rarity='Silver' tokenGenerated={2} img={AccessoryIconSilver} />
            <AccessoriesGeneration rarity='Gold' tokenGenerated={3} img={AccessoryIconGold} />
            <AccessoriesGeneration rarity='Diamond' tokenGenerated={5} img={AccessoryIconDiamond} />
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
        <div className={style['content-container']}>
          <h2>TOKEN GENERATED <br /> BY THE COLONY</h2>
          <div className={style.counter}>
            {tokensGeneratedByTheColonyData === undefined ? 0 : tokensGeneratedByTheColonyData.tokensGenerated}
          </div>
        </div>

      </section>

      <StakePopup isVisible={isStakePopupVisible} closeModal={() => setIsStakePopupVisible(false)} setTransactionSessionId={setTransactionSessionId} penguinsStakedArray={penguinsStakedArray} penguinsUnstakedArray={penguinsUnstakedArray} />
    </div>

  )
}
