import React from 'react'
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import { refreshAccount } from '@elrondnetwork/dapp-core/utils';
import ItemsInventory from 'components/Inventory/ItemsInventory/ItemsInventory';
import NavigationStakedType from 'components/Inventory/NavigationType/NavigationStakingType';
import { penguinCollection, stakingContract } from 'config';
import useGetUserOwnedAmount from 'sdk/hooks/api/useGetUserOwnedAmount';
import useGetStakingInventory from 'sdk/hooks/pages/useGetStakingInventory';
import stakeTransactionBuilder from 'sdk/transactionsBuilders/staking/stakeTransactionBuilder';
import Popup from '../Generic/Popup';
import style from './StakePopup.module.scss'


const StakePopup = (
    {
        isVisible,
        closeModal
    }:{
        isVisible: boolean,
        closeModal: () => void
    }
) => {
    const { address: connectedAddress } = useGetAccountInfo();
    const ownedAmount = useGetUserOwnedAmount();

    const {
        inventoryType,
        inventoryElements,
        penguinsCount,
        stakedPenguinsCount,
        setInventoryType
    } = useGetStakingInventory(connectedAddress);
    

    const stake= new stakeTransactionBuilder();
    stake.setStakingContract(stakingContract);

    const stakeFunc = async (type:string, itemNonce : number) => {    
          
        stake.setStaking({collection: penguinCollection, nonce: itemNonce, connectedAddress : connectedAddress});
        const transaction = stake.build(type);
        
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

 

    return <Popup haveCloseButton={true} isVisible={isVisible} onCloseClicked={closeModal}  >
        <NavigationStakedType className={style['navigation-type']} onChangeType={setInventoryType} itemsType={inventoryType} stakedPenguinsCount={stakedPenguinsCount} unstakedPenguinsCount={penguinsCount} />
        <table className="table">
            <tbody> 
                {/* <Button onClick={() => stakeFunc(203)}>Stake</Button> */}
                {inventoryElements &&
                    <ItemsInventory
                        className={style['items-inventory']}
                        items={inventoryElements}
                        type='penguins'
                        amountById={ownedAmount ? ownedAmount['penguins'] : {}}
                        hasFilter={false}
                        displayStakingStatus={true}
                        isStaked={inventoryType === 'staked' ? true : false}
                        stakingFunction={stakeFunc}
                         />
                }
            </tbody>
        </table>
    </Popup>
}

export default StakePopup;