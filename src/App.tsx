import React, { Suspense } from 'react';
import {
  TransactionsToastList,
  SignTransactionsModals,
  NotificationModal
} from '@elrondnetwork/dapp-core/UI';
import { DappProvider } from '@elrondnetwork/dapp-core/wrappers';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Layout from 'components/Layout';
import Home from 'pages/Home';
import PageNotFound from 'pages/PageNotFound';
import UnlockModal from 'pages/UnlockModal';
import routes, { routeNames } from 'routes';

const environment = 'devnet';

const App = () => {
  return <>
    <Router>
      <DappProvider
        environment={environment}
        customNetworkConfig={{ name: 'customConfig', apiTimeout: 6000 }}
      >
        <Layout>
          <TransactionsToastList />
          <NotificationModal />
          <SignTransactionsModals className='custom-class-for-modals' />

          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                path={routeNames.unlock}
                element={<>
                  <Home />
                  <UnlockModal loginRoute={routeNames.home} />
                </>
                }
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
          </Suspense>
        </Layout>
      </DappProvider>
    </Router>
  </>;
};

export default App;
