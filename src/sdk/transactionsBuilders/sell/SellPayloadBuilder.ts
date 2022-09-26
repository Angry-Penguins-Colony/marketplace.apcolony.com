import { AddressValue, ArgSerializer, BigIntValue, BooleanValue, BytesValue, IAddress, OptionType, OptionValue, TransactionPayload, U64Type, U64Value } from '@elrondnetwork/erdjs/out';
import BigNumber from 'bignumber.js';

export class SellPayloadBuilder {

    private tokenCollection = '';
    private tokenNonce = -1;
    private marketplaceSc?: IAddress;
    private price?: BigNumber;

    public setToken(collection: string, nonce: number): SellPayloadBuilder {
        this.tokenCollection = collection;
        this.tokenNonce = nonce;
        return this;
    }

    public setMarketplaceSc(marketplaceSc: IAddress): SellPayloadBuilder {
        this.marketplaceSc = marketplaceSc;
        return this;
    }

    public setPrice(price: BigNumber): SellPayloadBuilder {
        this.price = price;
        return this;
    }

    build(): TransactionPayload {

        if (!this.marketplaceSc) throw new Error('marketplaceSc is required');
        if (!this.price) throw new Error('price is required');

        const args = [
            BytesValue.fromUTF8(this.tokenCollection),
            new U64Value(this.tokenNonce),
            new U64Value(1), // quantity
            new AddressValue(this.marketplaceSc),
            BytesValue.fromUTF8('actionToken'),
            new BigIntValue(this.price),
            new BigIntValue(this.price),
            new U64Value(3_000_000_000), // deadline
            BytesValue.fromUTF8('EGLD'), // accepted payment token
            new OptionValue(new OptionType(new U64Type())), // opt_min_bid_diff
            new BooleanValue(true), // opt_sft_max_one_per_payment
        ];

        const { argumentsString } = new ArgSerializer().valuesToString(args);
        const data = 'ESDTNFTTransfer@' + argumentsString;

        return new TransactionPayload(data);
    }
}
