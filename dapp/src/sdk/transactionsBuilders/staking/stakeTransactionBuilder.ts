import { Address, AddressValue, ArgSerializer, BytesValue, StringValue, U64Value } from '@elrondnetwork/erdjs/out';
import BigNumber from 'bignumber.js';
import Price from 'sdk/classes/Price';

export default class stakeTransactionBuilder {

    private stakingContract?: Address;
    private connecteAddress?: string;
    private collection = '';
    private nonces:number[] = [];


    public setStakingContract(stakingContract: Address): stakeTransactionBuilder {
        this.stakingContract = stakingContract;
        return this;
    }

    public setStaking(staking: {collection: string, nonces: number[], connectedAddress: string }): stakeTransactionBuilder {
        this.collection = staking.collection;
        this.nonces = staking.nonces;
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

            const preArg = new ArgSerializer().valuesToString([
                new AddressValue(this.stakingContract), // receiver
                new U64Value(new BigNumber(this.nonces.length)),

            ]).argumentsString;

            let noncesArg = '';
            this.nonces.map((nonce) => {
                noncesArg += new ArgSerializer().valuesToString([BytesValue.fromUTF8(this.collection)]).argumentsString + '@' + nonce.toString(16) + '@' + '01' + '@';
            });

            const postArg = new ArgSerializer().valuesToString([
                new StringValue('stake'), // amount
            ]).argumentsString;

            return 'MultiESDTNFTTransfer@'+ preArg + '@' + noncesArg + postArg;
            

        }else if(type === 'unstake') {
            //return 'unstake@00000000000000' + argumentsString;
            let noncesArg = '';
            this.nonces.map((nonce) => {
                noncesArg +=  '00000000000000' + nonce.toString(16);
            });
            return 'unstake@' + noncesArg;
        }
    }
}