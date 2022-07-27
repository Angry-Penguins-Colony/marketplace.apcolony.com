import { IAddress } from '@elrondnetwork/erdjs-walletcore/out/interface';
import BigNumber from 'bignumber.js';

export default interface IOffer {
    price: BigNumber,
    listedBy: IAddress
}