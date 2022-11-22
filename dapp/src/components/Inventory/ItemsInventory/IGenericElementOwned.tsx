import { IGenericElement } from '@apcolony/marketplace-api';


export interface IGenericElementOwned extends IGenericElement {
    ownedAmount?: number;
}
