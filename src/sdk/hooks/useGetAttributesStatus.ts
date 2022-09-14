import React from 'react';
import { IAttributesStatus } from '@apcolony/marketplace-api';
import { Attributes } from '@apcolony/marketplace-api/out/classes';
import axios from 'axios';
import { marketplaceApi } from 'config';

function useGetAttributesStatus(attributes: Attributes | undefined): IAttributesStatus | undefined {

    const [attributesStatus, setAttributesStatus] = React.useState<IAttributesStatus | undefined>(undefined);

    React.useEffect(() => {
        async function get() {
            if (!attributes) return;

            const url = marketplaceApi + 'attributes?' + attributes.toApiParameters();
            const res = await axios.get(url);

            console.log(url);

            setAttributesStatus(res.data.data)
        }

        get();
    }, [attributes]);

    return attributesStatus;
}

export default useGetAttributesStatus;