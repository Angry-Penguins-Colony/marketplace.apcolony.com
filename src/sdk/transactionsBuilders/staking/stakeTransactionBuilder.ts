import { Address, AddressValue, ArgSerializer, BytesValue, StringValue, U64Value } from '@elrondnetwork/erdjs/out';
import BigNumber from 'bignumber.js';
import Price from 'sdk/classes/Price';

export default class stakeTransactionBuilder {

    private stakingContract?: Address;
    private connecteAddress?: string;
    private collection = '';
    private nonce = 0;


    public setStakingContract(stakingContract: Address): stakeTransactionBuilder {
        this.stakingContract = stakingContract;
        return this;
    }

    public setStaking(staking: {collection: string, nonce: number, connectedAddress: string }): stakeTransactionBuilder {
        this.collection = staking.collection;
        this.nonce = staking.nonce;
        this.connecteAddress = staking.connectedAddress;
        return this;
    }

    build(type : string) {

        if (this.stakingContract === undefined) throw new Error('stakingContract is undefined');

        return {
            value: Price.fromEgld(0).toString(),
            receiver: type === 'stake' ? this.connecteAddress : this.stakingContract.bech32(),
            data: this.getData(type),
            gasLimit: 50_000_000
        }
    }

    private getData(type:string) {
        if (this.stakingContract === undefined) throw new Error('stakingContract is undefined');

        if (type === 'stake') {
            const { argumentsString } = new ArgSerializer().valuesToString([
                BytesValue.fromUTF8(this.collection),
                new U64Value(new BigNumber(this.nonce)),
                new U64Value(new BigNumber(1)),
                new AddressValue(this.stakingContract), // receiver
                new StringValue('stake'), // amount
            ]);

            return 'ESDTNFTTransfer@' + argumentsString;

        }else if(type === 'unstake') {
            const { argumentsString } = new ArgSerializer().valuesToString([
                new U64Value(new BigNumber(this.nonce)),
            ]);

            return 'unstake@00000000000000' + argumentsString;
        }
    }
}