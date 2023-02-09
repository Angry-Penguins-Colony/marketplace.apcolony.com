import React from 'react'
import { IPenguin } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import { refreshAccount } from '@elrondnetwork/dapp-core/utils';
import Button from 'components/Abstract/Button/Button';
import { LOADER } from 'components/Images/ReactImageAppear/constants';
import ItemsInventory from 'components/Inventory/ItemsInventory/ItemsInventory';
import NavigationStakedType from 'components/Inventory/NavigationType/NavigationStakingType';
import { penguinCollection, stakingContract } from 'config';
import useGetStakingInventory from 'sdk/hooks/pages/useGetStakingInventory';
import stakeTransactionBuilder from 'sdk/transactionsBuilders/staking/stakeTransactionBuilder';
import Popup from '../Generic/Popup';
import style from './StakePopup.module.scss'
import './StakePopup.css'

const StakePopup = (
    {
        isVisible,
        closeModal,
        setTransactionSessionId,
        penguinsStakedArray,
        penguinsUnstakedArray
    }: {
        isVisible: boolean,
        closeModal: () => void,
        setTransactionSessionId: (sessionId: string | null) => void,
        penguinsStakedArray: Array<IPenguin> | undefined,
        penguinsUnstakedArray: Array<IPenguin> | undefined
    }
) => {
    const { address: connectedAddress } = useGetAccountInfo();
    const [noncesForStakingTx, setNoncesForStakingTx] = React.useState<number[]>([]);

    const {
        inventoryType,
        inventoryElements,
        penguinsCount,
        stakedPenguinsCount,
        setInventoryType
    } = useGetStakingInventory(connectedAddress, penguinsStakedArray, penguinsUnstakedArray);


    const stake = new stakeTransactionBuilder();
    stake.setStakingContract(stakingContract);

    const stakeFunc = async (type: string) => {

        stake.setStaking({ collection: penguinCollection, nonces: noncesForStakingTx, connectedAddress: connectedAddress });
        const transaction = stake.build(type);

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
            setNoncesForStakingTx([]);
        }
    }

    const addNonceToStakingTx = async (itemNonce: number) => {
        if (noncesForStakingTx.includes(itemNonce)) {
            setNoncesForStakingTx(noncesForStakingTx.filter((nonce) => nonce !== itemNonce));
        } else {
            setNoncesForStakingTx([...noncesForStakingTx, itemNonce]);
        }
    }

    return <Popup haveCloseButton={true} isVisible={isVisible} onCloseClicked={closeModal} className='stakingPopup' >
        {penguinsStakedArray && penguinsUnstakedArray ?
            <>
                <NavigationStakedType className={style['navigation-type']} onClick={() => setNoncesForStakingTx([])} onChangeType={setInventoryType} itemsType={inventoryType} stakedPenguinsCount={stakedPenguinsCount} unstakedPenguinsCount={penguinsCount} />
                <ItemsInventory
                    className={style['items-inventory'] + ' ' + 'items-inventory'}
                    items={inventoryElements}
                    type='penguins'
                    hasFilter={false}
                    displayStakingStatus={true}
                    addNonceToStakingTx={addNonceToStakingTx}
                    noncesForStakingTx={noncesForStakingTx}
                />
            </>
            :
            <img src={LOADER} alt="loader" className={style['loader']} />}
            { inventoryElements && inventoryElements.length > 0 &&
                <Button 
                    onClick={() => stakeFunc(inventoryType == 'unstaked' ? 'stake' : 'unstake')} 
                    className={`stakingButton ${noncesForStakingTx.length == 0 && 'disabled'}`} 
                    type='primary-outline'>{inventoryType == 'unstaked' ? 'Stake' : 'Unstake'}  {noncesForStakingTx.length > 0 ? ' (' + noncesForStakingTx.length + ')' : ''}
                </Button>
            }
    </Popup>
}

export default StakePopup;