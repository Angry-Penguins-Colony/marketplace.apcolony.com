import { IOffer } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { SimpleTransactionType } from '@elrondnetwork/dapp-core/types';
import BigNumber from 'bignumber.js';
import { marketplaceContractAddress, penguinCollection, items } from 'config';
import RetireOfferTransactionBuilder from 'sdk/transactionsBuilders/retireOffer/RetireOfferTransactionBuilder';
import { SellPayloadBuilder } from 'sdk/transactionsBuilders/sell/SellPayloadBuilder';
import CategoriesType from 'sdk/types/CategoriesType';
import useGetActivity from './api/useGetActivity';
import { useGetGenericItem } from './api/useGetGenericItem';
import useGetPenguin from './api/useGetPenguin';

function useInspect(category: CategoriesType, id: string) {
    const { address: connectedAddress } = useGetAccountInfo();
    const item = useGetGenericItem(category, id);

    const itemAsPenguin = useGetPenguin(id); // TODO: FIX 404 error in /items path
    const activities = useGetActivity(category, id);

    const ownedByConnectedWallet = (() => {
        if (category === 'penguins') return itemAsPenguin?.owner === connectedAddress;
        if (category === 'items' && item?.amount) return item?.amount > 0;
        return false;
    })()


    return {
        item,
        ownedByConnectedWallet,
        activities,
        itemAsPenguin,
        getSellTransaction,
        getRetireTransaction
    }

    function getSellTransaction(price: BigNumber): SimpleTransactionType {
        const { collection, nonce } = getToken();
        const payload = new SellPayloadBuilder()
            .setPrice(price)
            .setMarketplaceSc(marketplaceContractAddress)
            .setToken(collection, nonce)
            .build();

        const transaction: SimpleTransactionType = {
            value: '0',
            data: payload.toString(),
            receiver: connectedAddress,
            gasLimit: 50_000_000,
        };

        return transaction;
    }

    function getRetireTransaction(offer: IOffer): SimpleTransactionType {
        return new RetireOfferTransactionBuilder()
            .setAuctionId(offer.id)
            .setMarketplaceContract(marketplaceContractAddress)
            .build();
    }

    function getToken() {
        switch (category) {
            case 'penguins':

                if (!itemAsPenguin) throw new Error('id is required');

                return {
                    collection: penguinCollection,
                    nonce: itemAsPenguin.nonce // id is the nonce
                };

            case 'items':
                const foundItem = items.find(i => i.id == id);

                if (!foundItem) throw new Error('Item not found');

                return {
                    collection: foundItem.collection,
                    nonce: foundItem.nonce
                };

            default:
                throw new Error('Unknown type');
        }
    }
}

export default useInspect;