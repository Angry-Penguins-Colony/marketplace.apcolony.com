import React from 'react';
import { IAttributesStatus } from '@apcolony/marketplace-api';
import { Attributes } from '@apcolony/marketplace-api/out/classes';
import doGetGeneric from 'sdk/api/doGetGeneric';
import { RenderTransactionFilter } from '../transactionsFilters/filters';
import useGetOnNewPendingTransaction from '../useGetOnTransactionPending';
import useGetOnTransactionSuccesful from '../useGetOnTransactionSuccesful';
import usePrevious from '../usePrevious';

const periodicRefreshMS = 10_000;

function useGetAttributesStatus(attributes: Attributes, penguinId: string) {

    const [attributesStatus, setAttributesStatus] = React.useState<IAttributesStatus | undefined>(undefined);
    const [forcePendingStatus, setForcePendingStatus] = React.useState<boolean>(false);
    const [forceRefresh, setForceRefresh] = React.useState<boolean>(false);
    const previousStatus = usePrevious(attributes);

    useGetOnNewPendingTransaction(() => {
        setForcePendingStatus(true)
    }, new RenderTransactionFilter(attributes));

    useGetOnTransactionSuccesful(() => {
        setForceRefresh(true);
    }, new RenderTransactionFilter(attributes));

    React.useEffect(() => {
        if (attributes && previousStatus && attributes.equals(previousStatus)) return;

        forceUpdate();
    });

    // when we are in pending status, we need to refresh the status periodically
    React.useEffect(() => {
        if (forceRefresh || (attributesStatus && attributesStatus.renderStatus == 'rendering')) {
            const interval = setInterval(() => {
                console.log('check')
                forceUpdate();
            }, periodicRefreshMS);

            return () => clearInterval(interval);
        }
    }, [forceRefresh, attributesStatus]);

    // stop pending status when we have a new status
    React.useEffect(() => {

        if (attributesStatus && attributesStatus.renderStatus == 'rendered') {
            setForcePendingStatus(false);
            setForceRefresh(false);
        }
    }, [attributesStatus])

    return {
        attributesStatus: forcePendingStatus ? { renderStatus: 'rendering' } : attributesStatus,
        forceUpdate
    };

    async function forceUpdate() {
        if (attributes == undefined) return;

        const url = `attributes/${penguinId}/?${attributes.toApiParameters()}`;

        const res = await doGetGeneric(url);

        setAttributesStatus(res.data.data)
    }
}

export default useGetAttributesStatus;