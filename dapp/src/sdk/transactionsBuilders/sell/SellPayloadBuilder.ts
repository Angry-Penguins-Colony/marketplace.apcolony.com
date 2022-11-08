
import { AddressValue, ArgSerializer, BigIntValue, BytesValue, IAddress, TransactionPayload, U64Value } from '@elrondnetwork/erdjs/out';

export class SellPayloadBuilder {

    private tokenCollection = '';
    private tokenNonce = -1;
    private marketplaceSc?: IAddress;
    private price = '0';

    public setToken(collection: string, nonce: number): SellPayloadBuilder {
        this.tokenCollection = collection;
        this.tokenNonce = nonce;
        return this;
    }

    public setMarketplaceSc(marketplaceSc: IAddress): SellPayloadBuilder {
        this.marketplaceSc = marketplaceSc;
        return this;
    }

    public setPrice(price: string): SellPayloadBuilder {
        this.price = price;
        return this;
    }

    build(): TransactionPayload {

        if (!this.marketplaceSc) throw new Error('marketplaceSc is required');
        if (isNaN(this.tokenNonce)) throw new Error('tokenNonce as NaN is not supported');

        const args = [
            BytesValue.fromUTF8(this.tokenCollection),
            new U64Value(this.tokenNonce),
            new U64Value(1), // quantity
            new AddressValue(this.marketplaceSc),
            BytesValue.fromUTF8('auctionToken'),
            new BigIntValue(this.price),
        ];

        const { argumentsString } = new ArgSerializer().valuesToString(args);
        const data = 'ESDTNFTTransfer@' + argumentsString;

        return new TransactionPayload(data);
    }
}
