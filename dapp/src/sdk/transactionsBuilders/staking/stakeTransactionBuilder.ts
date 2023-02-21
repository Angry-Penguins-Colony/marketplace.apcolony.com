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
                noncesArg += new ArgSerializer().valuesToString([BytesValue.fromUTF8(this.collection)]).argumentsString + '@' + DecimalHexTwosComplement(nonce, 4) + '@' + '01' + '@';
            });

            const postArg = new ArgSerializer().valuesToString([
                new StringValue('stake'), // amount
            ]).argumentsString;

            return 'MultiESDTNFTTransfer@'+ preArg + '@' + noncesArg + postArg;
            

        }else if(type === 'unstake') {
            //return 'unstake@00000000000000' + argumentsString;
            let noncesArg = '';
            this.nonces.map((nonce) => {
                noncesArg +=  DecimalHexTwosComplement(nonce, 16);
            });
            return 'unstake@' + noncesArg;
        }
    }
}

function DecimalHexTwosComplement(decimal: number, size: number) {

    if (decimal >= 0) {
      let hexadecimal = decimal.toString(16);

      while (hexadecimal.length % size != 0) {
        hexadecimal = '' + 0 + hexadecimal;
      }

      return hexadecimal;
    } else {
      let hexadecimal = Math.abs(decimal).toString(16);
      while (hexadecimal.length % size != 0) {
        hexadecimal = '' + 0 + hexadecimal;
      }

      let output = '';
      for (let i = 0; i < hexadecimal.length; i++) {
        output += (0x0f - parseInt(hexadecimal[i], 16)).toString(16);
      }

      output = (0x01 + parseInt(output, 16)).toString(16);
      return output;
    }
}