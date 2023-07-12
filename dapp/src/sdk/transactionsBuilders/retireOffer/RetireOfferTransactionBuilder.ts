import { IAddress } from '@apcolony/marketplace-api';
import { ArgSerializer, U64Value } from '@multiversx/sdk-core/out';
import { SimpleTransactionType } from '@multiversx/sdk-dapp/types';

export default class RetireOfferTransactionBuilder {

    private marketplaceContract?: IAddress;
    private auctionId = 0;

    public setMarketplaceContract(marketplaceContract: IAddress): RetireOfferTransactionBuilder {
        this.marketplaceContract = marketplaceContract;
        return this;
    }

    public setAuctionId(auctionId: number): RetireOfferTransactionBuilder {
        this.auctionId = auctionId;
        return this;
    }

    build(): SimpleTransactionType {

        if (this.marketplaceContract === undefined) throw new Error('marketplaceContract is undefined');

        return {
            value: '0',
            receiver: this.marketplaceContract.bech32(),
            data: this.getData(),
            gasLimit: 50_000_000
        }
    }

    private getData() {
        const { argumentsString } = new ArgSerializer().valuesToString([
            new U64Value(this.auctionId),
        ]);

        return 'withdraw@' + argumentsString;
    }
}