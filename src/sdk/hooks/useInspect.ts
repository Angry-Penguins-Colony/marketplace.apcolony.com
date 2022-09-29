import { IOffer } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { SimpleTransactionType } from '@elrondnetwork/dapp-core/types';
import BigNumber from 'bignumber.js';
import { marketplaceContractAddress } from 'config';
import RetireOfferTransactionBuilder from 'sdk/transactionsBuilders/retireOffer/RetireOfferTransactionBuilder';
import { SellPayloadBuilder } from 'sdk/transactionsBuilders/sell/SellPayloadBuilder';
import CategoriesType from 'sdk/types/CategoriesType';
import useGetActivity from './api/useGetActivity';
import { useGetGenericItem } from './api/useGetGenericItem';

function useInspect(category: CategoriesType, id: string) {
    const { address: connectedAddress } = useGetAccountInfo();
    const item = useGetGenericItem(category, id);
    const activities = useGetActivity(category, id);

    return {
        item,
        activities,
        getSellTransaction,
        getRetireTransaction
    }

    function getSellTransaction(price: BigNumber): SimpleTransactionType {
        if (!item) throw new Error('Item not found');

        const payload = new SellPayloadBuilder()
            .setPrice(price)
            .setMarketplaceSc(marketplaceContractAddress)
            .setToken(item.collection, item.nonce)
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
}

export default useInspect;