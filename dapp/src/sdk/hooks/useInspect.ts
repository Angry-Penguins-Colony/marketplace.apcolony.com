import { IOffer, IPenguin } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { SimpleTransactionType } from '@multiversx/sdk-dapp/types';
import { marketplaceContractAddress } from 'config';
import Price from 'sdk/classes/Price';
import RetireOfferTransactionBuilder from 'sdk/transactionsBuilders/retireOffer/RetireOfferTransactionBuilder';
import { SellPayloadBuilder } from 'sdk/transactionsBuilders/sell/SellPayloadBuilder';
import CategoriesType from 'sdk/types/CategoriesType';
import useGetActivity from './api/useGetActivity';
import { useGetGenericItem } from './api/useGetGenericItem';
import useGetOffers from './api/useGetOffers';
import useGetOffersOfCategory from './api/useGetOffersOfCategory';
import { RetireTransactionFilter, SellTransactionFilter } from './transactionsFilters/filters';
import useGetOnTransactionSuccesful from './useGetOnTransactionSuccesful';

function useInspect(category: CategoriesType, id: string, onWrongId: () => void = () => { }) {
    const { address: connectedAddress } = useGetAccountInfo();
    const { data: item, forceReload: forceReloadItem } = useGetGenericItem(category, id, { onGetError: onWrongId });
    const { data: activities } = useGetActivity(category, id, { onGetError: onWrongId });

    const offers = useGetOffers(category, id);
    // TODO: this useGetOffersOfCategory is only used by penguins. We must find a better way to remove this call when items.
    const offersOfCategory = useGetOffersOfCategory(category)


    const isOwnedByConnected = (() => {

        if (!item) return undefined;

        switch (category) {
            case 'items':
            case 'eggs':
                return item.ownedAmount != undefined ? item.ownedAmount > 0 : undefined;

            case 'penguins':
                return (item as IPenguin).owner == connectedAddress;

            default:
                throw new Error(`Unknown category ${category}`);
        }
    })();

    const floorPrice = (() => {

        switch (category) {
            case 'items':
            case 'eggs':
                return offers.floorPriceOffer ? Price.fromEgld(offers.floorPriceOffer.price) : undefined;

            case 'penguins':
                return offersOfCategory.floorOffer ? Price.fromEgld(offersOfCategory.floorOffer.price) : undefined;

            default:
                throw new Error(`Unknown category ${category}`);
        }
    })();

    const ownedOrListedByConnectedWallet = isOwnedByConnected || offers.isListedByConnected;
    const canBuy = (category == 'penguins' && ownedOrListedByConnectedWallet == false) || category != 'penguins';

    useGetOnTransactionSuccesful(
        () => forceReloadItem(),
        new SellTransactionFilter()
    );

    useGetOnTransactionSuccesful(
        () => forceReloadItem(),
        new RetireTransactionFilter()
    );

    return {
        item,
        activities,
        getSellTransaction,
        getRetireTransaction,
        ownedOrListedByConnectedWallet,
        canBuy,
        isOwnedByConnected,
        floorPrice,
        ...offers
    }

    function getSellTransaction(price: Price): SimpleTransactionType {
        if (!item) throw new Error('Item not found');

        const payload = new SellPayloadBuilder()
            .setPrice(price.toString())
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