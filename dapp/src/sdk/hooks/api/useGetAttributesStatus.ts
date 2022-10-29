import React from 'react';
import { IAttributesStatus } from '@apcolony/marketplace-api';
import { Attributes } from '@apcolony/marketplace-api/out/classes';
import axios from 'axios';
import { apcLogger, marketplaceApi } from 'config';
import { RenderTransactionFilter } from '../transactionsFilters/filters';
import useGetOnNewPendingTransaction from '../useGetOnTransactionPending';
import usePrevious from '../usePrevious';

const periodicRefreshMS = 3_000;

function useGetAttributesStatus(attributes: Attributes, penguinId: string) {

    const [attributesStatus, setAttributesStatus] = React.useState<IAttributesStatus | undefined>(undefined);
    const [forcePendingStatus, setForcePendingStatus] = React.useState<boolean>(false);
    const previousStatus = usePrevious(attributes);

    useGetOnNewPendingTransaction(() => {
        setForcePendingStatus(true)
    },
        new RenderTransactionFilter(attributes));

    React.useEffect(() => {
        if (attributes && previousStatus && attributes.equals(previousStatus)) return;

        forceUpdate();
    });

    // when we are in pending status, we need to refresh the status periodically
    React.useEffect(() => {
        if (forcePendingStatus || (attributesStatus && attributesStatus.renderStatus == 'rendering')) {
            const interval = setInterval(() => {
                console.log('check')
                forceUpdate();
            }, periodicRefreshMS);

            return () => clearInterval(interval);
        }
    }, [forcePendingStatus, attributesStatus]);

    // stop pending status when we have a new status
    React.useEffect(() => {

        if (forcePendingStatus && attributesStatus?.renderStatus == 'rendered') {
            setForcePendingStatus(false);
        }
    }, [attributesStatus])

    return {
        attributesStatus: forcePendingStatus ? { renderStatus: 'rendering' } : attributesStatus,
        forceUpdate
    };

    async function forceUpdate() {
        if (attributes == undefined) return;

        const url = `${marketplaceApi}attributes/${penguinId}/?${attributes.toApiParameters()}`;
        apcLogger.apiCall(url);

        const res = await axios.get(url);

        setAttributesStatus(res.data.data)
    }
}

export default useGetAttributesStatus;