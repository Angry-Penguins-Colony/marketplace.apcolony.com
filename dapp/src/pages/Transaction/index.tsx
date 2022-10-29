import * as React from 'react';
import { useGetNetworkConfig } from '@elrondnetwork/dapp-core/hooks/useGetNetworkConfig';
import { PageState } from '@elrondnetwork/dapp-core/UI/PageState';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useLocation, Link } from 'react-router-dom';
import { routeNames } from 'routes';

const Transaction = () => {
  const { search } = useLocation();
  const { network } = useGetNetworkConfig();

  const query = new URLSearchParams(search);
  const { status, txHash } = Object.fromEntries(query);

  return status === 'success' ? (
    <PageState
      icon={faCheck}
      iconClass='fa-3x text-success'
      className='dapp-icon icon-medium'
      title='Transaction submitted successfully'
      description={
        <>
          <p>
            <a
              href={`${network.explorerAddress}/transactions/${txHash}`}
              {...{
                target: '_blank'
              }}
              className='tx-link'
              title='View in Explorer'
            >
              {txHash}
            </a>
          </p>
          <Link to={routeNames.home} className='btn btn-primary mt-3'>
            Back to home
          </Link>
        </>
      }
    />
  ) : (
    <PageState
      icon={faTimes}
      iconClass='fa-3x text-danger'
      className='dapp-icon icon-medium'
      title='Error sending transaction'
      description={
        <>
          <p>Try again</p>
          <a href={routeNames.home} className='btn btn-primary mt-3'>
            Back to home
          </a>
        </>
      }
    />
  );
};

export default Transaction;
