import { IAddress } from '@apcolony/marketplace-api';
import { SimpleTransactionType } from '@elrondnetwork/dapp-core/types';
import { ArgSerializer, BytesValue, U64Value } from '@elrondnetwork/erdjs/out';
import Price from 'sdk/classes/Price';

export default class BuyOfferTransactionBuilder {

    private marketplaceContract?: IAddress;
    private auctionId = 0;
    private collection = '';
    private nonce = 0;
    private price = '0';


    public setMarketplaceContract(marketplaceContract: IAddress): BuyOfferTransactionBuilder {
        this.marketplaceContract = marketplaceContract;
        return this;
    }

    public setOffer(offer: { id: number, collection: string, nonce: number, price: string }): BuyOfferTransactionBuilder {
        this.auctionId = offer.id;
        this.collection = offer.collection;
        this.nonce = offer.nonce;
        this.price = offer.price;
        return this;
    }

    build(): SimpleTransactionType {

        if (this.marketplaceContract === undefined) throw new Error('marketplaceContract is undefined');

        return {
            value: Price.fromEgld(this.price).toString(),
            receiver: this.marketplaceContract.bech32(),
            data: this.getData(),
            gasLimit: 50_000_000
        }
    }

    private getData() {
        const { argumentsString } = new ArgSerializer().valuesToString([
            new U64Value(this.auctionId),
            BytesValue.fromUTF8(this.collection),
            new U64Value(this.nonce),
        ]);

        return 'buySft@' + argumentsString;
    }
}