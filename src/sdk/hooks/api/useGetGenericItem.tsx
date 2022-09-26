import * as React from 'react';
import { IItem, IPenguin } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { ipfsGateway } from 'config';
import useGenericAPICall from 'sdk/hooks/api/useGenericAPICall';
import CategoriesType from 'sdk/types/CategoriesType';
import { GenericItem } from '../../types/GenericItem';

export function useGetGenericItem(type: CategoriesType, id: string) {

    const [data, setData] = React.useState<GenericItem | undefined>(undefined);
    const [ownedByConnected, setOwnedByConnected] = React.useState<boolean | undefined>(undefined);

    const raw = useGenericAPICall<any>(`${type}/${id}`);
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
                    price: -1
                });

                setOwnedByConnected(penguin.owner == connectedAddress);
                break;

            case 'items':
                const item = raw as IItem;

                setData({
                    name: item.name,
                    thumbnail: ipfsGateway + item.thumbnailCID,
                    items: [],
                    rank: -1,
                    price: -1,
                });

                setOwnedByConnected(item.amount > 0);
                break;

            default:
                throw new Error('Invalid type');
        }

    }, [raw, type, id]);

    return {
        item: data,
        ownedByConnectedWallet: ownedByConnected
    };
}
