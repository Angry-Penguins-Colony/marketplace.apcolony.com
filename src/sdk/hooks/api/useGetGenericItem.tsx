import * as React from 'react';
import { IItem, IPenguin } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { ipfsGateway, items, penguinCollection } from 'config';
import useGenericAPICall from 'sdk/hooks/api/useGenericAPICall';
import CategoriesType from 'sdk/types/CategoriesType';
import { GenericItem } from '../../types/GenericItem';

export function useGetGenericItem(type: CategoriesType, id: string) {

    const [data, setData] = React.useState<GenericItem | undefined>(undefined);
    const { address } = useGetAccountInfo();

    const singularType = type == 'penguins' ? 'penguin' : 'item';
    const raw = useGenericAPICall<any>(`${type}/${singularType}/${id}` + (address != '' ? `?owner=${address}` : ''));
    const { address: connectedAddress } = useGetAccountInfo();

    React.useEffect(() => {

        if (!raw)
            return;

        switch (type) {
            case 'penguins':
                const penguin = raw as IPenguin;

                setData({
                    name: penguin.name,
                    thumbnail: ipfsGateway + penguin.thumbnailCID,
                    items: Object.values(penguin.equippedItems),
                    rank: -1,
                    price: -1,
                    amount: penguin.owner == connectedAddress ? 1 : 0,
                    owner: penguin.owner,
                    nonce: penguin.nonce,
                    collection: penguinCollection
                });
                break;

            case 'items':
                const item = raw as IItem;

                const index = items.findIndex(i => i.id == id);
                const { collection } = items[index];

                setData({
                    name: item.name,
                    thumbnail: ipfsGateway + item.thumbnailCID,
                    items: [],
                    rank: -1,
                    price: -1,
                    amount: item.amount,
                    nonce: item.nonce,
                    collection: collection
                });
                break;

            default:
                throw new Error('Invalid type');
        }

    }, [raw, type, id]);

    return data;
}
