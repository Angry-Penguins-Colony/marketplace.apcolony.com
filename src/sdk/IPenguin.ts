import { Nonce } from '@elrondnetwork/erdjs/out';
import IItem from './IItem';
import IOffer from './IOffer';

export default interface IPenguin {
    identifier: string,
    name: string,
    nonce: Nonce,
    score: number,
    purchaseDate: Date,
    thumbnailCID: string,
    equippedItems: { [key: string]: IItem; },
    offer?: IOffer | undefined
}