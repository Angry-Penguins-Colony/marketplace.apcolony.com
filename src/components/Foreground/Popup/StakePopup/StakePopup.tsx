import React from 'react'
import { IGenericElement } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import { refreshAccount } from '@elrondnetwork/dapp-core/utils';
import ItemsInventory from 'components/Inventory/ItemsInventory/ItemsInventory';
import { penguinCollection, stakingContract } from 'config';
import { useGetOwnedPenguins } from 'sdk/hooks/api/useGetOwned';
import useGetUserOwnedAmount from 'sdk/hooks/api/useGetUserOwnedAmount';
import stakeTransactionBuilder from 'sdk/transactionsBuilders/staking/stakeTransactionBuilder';
import StakedType from 'sdk/types/StakedTypes';
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
    const [inventoryElements, setElements] = React.useState<IGenericElement[] | undefined>(undefined);
    const [inventoryType, setInventoryType] = React.useState<StakedType>('penguinsNonStaked');
    const ownedAmount = useGetUserOwnedAmount();
    const penguins = useGetOwnedPenguins(); 

    
    

    const stake= new stakeTransactionBuilder();
    stake.setStakingContract(stakingContract);

    function onChangeType(type: string) {
        switch (type) {
            case 'penguinsNonStaked':
                setElements(penguins);
                setInventoryType('penguinsNonStaked');
                break;

            case 'penguinsStaked':
            default:
                setElements(penguins);
                setInventoryType('penguinsStaked');
                break;
        }
    }

    React.useEffect(() => {
        onChangeType(inventoryType); 
    }, [penguins]);

    const stakeFunc = async (itemNonce : number) => {
        console.log('stakeFunc', itemNonce);
        
        stake.setStaking({collection: penguinCollection, nonce: itemNonce, connectedAddress : connectedAddress});
        const transaction = stake.build();
        
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
                        isStaked={false}
                        stakingFunction={stakeFunc}
                         />
                }
            </tbody>
        </table>
    </Popup>
}

export default StakePopup;