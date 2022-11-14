import React from 'react';
import { IGenericElement, IItem, IPenguin } from '@apcolony/marketplace-api';
import { shuffle } from 'lodash';
import useGenericAPICall from './useGenericAPICall';

interface ExploreItemsResponse {
    penguins: IPenguin[];
    items: IItem[];
}

function useGetExploreItems(): IGenericElement[] | undefined {

    const { data: exploreItems } = useGenericAPICall<ExploreItemsResponse>('exploreItems');

    const [genericItems, setGenericItems] = React.useState<IGenericElement[] | undefined>(undefined);


    React.useEffect(() => {
        if (exploreItems) {
            setGenericItems(shuffle([...exploreItems.penguins, ...exploreItems.items]));
        }

    }, [exploreItems]);

    return genericItems;
}

export default useGetExploreItems;