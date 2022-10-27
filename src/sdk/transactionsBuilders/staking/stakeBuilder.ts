import { IAddress } from '@apcolony/marketplace-api';
import { SimpleTransactionType } from '@elrondnetwork/dapp-core/types';
import { Address, AddressValue, ArgSerializer, BytesValue, ContractFunction, ESDTNFTTransferPayloadBuilder, StringValue, TokenPayment, U64Value } from '@elrondnetwork/erdjs/out';
import BigNumber from 'bignumber.js';
import Price from 'sdk/classes/Price';

export default class stakeBuilder {

    private stakingContract?: Address;
    private connecteAddress?: string;
    private collection = '';
    private nonce = 0;


    public setStakingContract(stakingContract: Address): stakeBuilder {
        this.stakingContract = stakingContract;
        return this;
    }

    public setStaking(staking: {collection: string, nonce: number, connectedAddress: string }): stakeBuilder {
        this.collection = staking.collection;
        this.nonce = staking.nonce;
        this.connecteAddress = staking.connectedAddress;
        return this;
    }

    build() {

        if (this.stakingContract === undefined) throw new Error('stakingContract is undefined');

        return {
            value: Price.fromEgld(0).toString(),
            receiver: this.connecteAddress,
            data: this.getData(),
            gasLimit: 50_000_000
        }
    }

    private getData() {
        if (this.stakingContract === undefined) throw new Error('stakingContract is undefined');

        const { argumentsString } = new ArgSerializer().valuesToString([
            BytesValue.fromUTF8(this.collection),
            new U64Value(new BigNumber(this.nonce)),
            new U64Value(new BigNumber(1)),
            new AddressValue(this.stakingContract), // receiver
            new StringValue('stake'), // amount
        ]);
      
        return 'ESDTNFTTransfer@' + argumentsString;
    }
}