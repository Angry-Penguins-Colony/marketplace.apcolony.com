import { Address } from '@elrondnetwork/erdjs/out';
import Price from 'sdk/classes/Price';

export default class ClaimTransactioNBuilder {

    private stakingContract?: Address;



    public setStakingContract(stakingContract: Address): ClaimTransactioNBuilder {
        this.stakingContract = stakingContract;
        return this;
    }

    build() {

        if (this.stakingContract === undefined) throw new Error('stakingContract is undefined');

        return {
            value: Price.fromEgld(0).toString(),
            receiver: this.stakingContract,
            data: this.getData(),
            gasLimit: 50_000_000
        }
    }

    private getData() {
        if (this.stakingContract === undefined) throw new Error('stakingContract is undefined');

        return 'claimRewards';
    }
}