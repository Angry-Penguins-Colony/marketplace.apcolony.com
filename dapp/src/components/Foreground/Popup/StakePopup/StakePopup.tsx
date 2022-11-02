import React from 'react'
import { IPenguin } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import { refreshAccount } from '@elrondnetwork/dapp-core/utils';
import { LOADER } from 'components/Images/ReactImageAppear/constants';
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
        closeModal,
        setTransactionSessionId,
        penguinsStakedArray,
        penguinsUnstakedArray
    }:{
        isVisible: boolean,
        closeModal: () => void,
        setTransactionSessionId: (sessionId: string | null) => void,
        penguinsStakedArray : Array<IPenguin> | undefined,
        penguinsUnstakedArray : Array<IPenguin> | undefined
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
    } = useGetStakingInventory(connectedAddress, penguinsStakedArray, penguinsUnstakedArray);
    

    const stake= new stakeTransactionBuilder();
    stake.setStakingContract(stakingContract);

    const stakeFunc = async (type:string, itemNonce : number) => {    
          
        stake.setStaking({collection: penguinCollection, nonce: itemNonce, connectedAddress : connectedAddress});
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
        }
    }

    return <Popup haveCloseButton={true} isVisible={isVisible} onCloseClicked={closeModal}  >
                {penguinsStakedArray && penguinsUnstakedArray ?  
                <>
                    <NavigationStakedType className={style['navigation-type']} onChangeType={setInventoryType} itemsType={inventoryType} stakedPenguinsCount={stakedPenguinsCount} unstakedPenguinsCount={penguinsCount} />
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
                </>     
                : 
                <img src={LOADER} alt="loader" className={style['loader']}  />}
     </Popup>
}

export default StakePopup;