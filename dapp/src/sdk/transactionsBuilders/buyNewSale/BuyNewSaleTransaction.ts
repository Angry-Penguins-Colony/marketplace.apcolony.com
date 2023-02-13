import { SimpleTransactionType } from '@elrondnetwork/dapp-core/types';
import { Address, ArgSerializer, BytesValue, U64Value } from '@elrondnetwork/erdjs/out';
import BigNumber from 'bignumber.js';

enum PaymentType { EGLD, ESDT }


const ENDPOINT_NAME = 'buy';


export default class BuyNewSaleTransactionBuilder {

    private paymentType: PaymentType = PaymentType.EGLD;
    private tokenIdentifier = '';
    private paymentValue: BigNumber = new BigNumber(0);

    constructor(
        private readonly contract: Address,
        private readonly auctionId: number
    ) { }

    setEgldPayment() {
        this.paymentType = PaymentType.EGLD;

        return this;
    }

    setTokenPayment(identifier: string) {
        if (identifier == 'EGLD') {
            return this.setEgldPayment();
        }
        else {
            this.paymentType = PaymentType.ESDT;
            this.tokenIdentifier = identifier;

            return this;
        }
    }

    setPaymentValue(balance: BigNumber) {
        this.paymentValue = balance;

        return this;
    }

    build(): SimpleTransactionType {

        // REFACTOR: switch is a smell pattern.
        switch (this.paymentType) {
            case PaymentType.EGLD:

                const egldData = ENDPOINT_NAME + '@' + new ArgSerializer().valuesToString([
                    new U64Value(this.auctionId)
                ]).argumentsString;

                return {
                    value: this.paymentValue.toString(),
                    receiver: this.contract.bech32(),
                    data: egldData,
                    gasLimit: 50_000_000
                }

            case PaymentType.ESDT:
                const esdtData = 'ESDTTransfer@' + new ArgSerializer().valuesToString([
                    BytesValue.fromUTF8(this.tokenIdentifier),
                    new U64Value(this.paymentValue),
                    BytesValue.fromUTF8(ENDPOINT_NAME),
                    new U64Value(this.auctionId)
                ]).argumentsString;

                return {
                    value: '0',
                    receiver: this.contract.bech32(), // TODO: send to self
                    data: esdtData,
                    gasLimit: 50_000_000
                }

            default:
                throw new Error('Not implemented');
        }
    }
}