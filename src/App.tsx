import React from 'react';
import {
  TransactionsToastList,
  SignTransactionsModals,
  NotificationModal
} from '@elrondnetwork/dapp-core/UI';
import { DappProvider } from '@elrondnetwork/dapp-core/wrappers';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import WIPModal from 'components/Foreground/Modals/WIPModal/WIPModal';
import Layout from 'components/Layout';
import PageNotFound from 'pages/PageNotFound';
import APCUnlockPage from 'pages/UnlockPage';
import routes, { routeNames } from 'routes';

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
              element={<APCUnlockPage loginRoute={routeNames.home} />}
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
