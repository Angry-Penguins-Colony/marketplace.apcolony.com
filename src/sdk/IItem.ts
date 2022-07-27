import { Nonce } from '@elrondnetwork/erdjs/out';
import IOffer from './IOffer';
import Slotname from './Slotname';

export default interface IItem {
    identifier: string,
    nonce: Nonce,
    slot: Slotname,
    name: string,
    thumbnailCID: string,
    offers?: IOffer[],
}