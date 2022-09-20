import React from 'react';
import { IAttributesStatus } from '@apcolony/marketplace-api';
import { Attributes } from '@apcolony/marketplace-api/out/classes';
import axios from 'axios';
import { apcLogger, marketplaceApi } from 'config';
import usePrevious from './usePrevious';

function useGetAttributesStatus(attributes: Attributes | undefined) {

    const [attributesStatus, setAttributesStatus] = React.useState<IAttributesStatus | undefined>(undefined);
    const previousStatus = usePrevious(attributes);

    React.useEffect(() => {

        if (attributes && previousStatus && attributes.equals(previousStatus)) return;

        forceUpdate();
    });

    return { attributesStatus, forceUpdate };

    async function forceUpdate() {
        if (attributes == undefined) return;

        const url = marketplaceApi + 'attributes?' + attributes.toApiParameters();
        apcLogger.apiCall(url);

        const res = await axios.get(url);

        setAttributesStatus(res.data.data)
    }
}

export default useGetAttributesStatus;