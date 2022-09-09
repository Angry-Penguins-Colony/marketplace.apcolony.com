import React from 'react';
import {
  TransactionsToastList,
  SignTransactionsModals,
  NotificationModal
} from '@elrondnetwork/dapp-core/UI';
import { DappProvider } from '@elrondnetwork/dapp-core/wrappers';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Layout from 'components/Layout';
import WIPModal from 'components/Modals/WIPModal/WIPModal';
import PageNotFound from 'pages/PageNotFound';
import UnlockPageFromTemplate from 'pages/UnlockPageFromTemplate';
import { routeNames } from 'routes';
import routes from 'routes';
import { UnlockRoute as UnlockPageBis } from './pages/UnlockPage';

const environment = 'devnet';

const App = () => {
  return <>
    <WIPModal />

    <Router>
      <DappProvider
        environment={environment}
        customNetworkConfig={{ name: 'customConfig', apiTimeout: 6000 }}
      >
        <Layout>
          <TransactionsToastList />
          <NotificationModal />
          <SignTransactionsModals className='custom-class-for-modals' />
          <Routes>
            <Route
              path={routeNames.unlock}
              // element={<UnlockPageBis /*loginRoute={routeNames.home}*/ />}
              // TODO: here is basic "connect wallet" page
              element={<UnlockPageFromTemplate />}
            />
            {routes.map((route: any, index: number) => (
              <Route
                path={route.path}
                key={'route-key-' + index}
                element={<route.component />}
              />
            ))}
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </Layout>
      </DappProvider>
    </Router>
  </>;
};

export default App;
