import BigNumber from 'bignumber.js';

export default class Price {

    private readonly completePrice: BigNumber;
    private readonly decimals: number;

    constructor(completePrice: BigNumber.Value, decimals: number) {
        this.completePrice = new BigNumber(completePrice);
        this.decimals = decimals;
    }

    toDenomination() {
        return new BigNumber(this.completePrice).div(10 ** this.decimals).toString();
    }

    toString() {
        return this.completePrice.toString();
    }

    static fromEgld(completePrice: BigNumber.Value) {
        const EGLD_DECIMALS = 18;
        return new Price(new BigNumber(completePrice).multipliedBy(10 ** EGLD_DECIMALS), EGLD_DECIMALS);
    }

    static zero() {
        return new Price('0', 0);
    }
}