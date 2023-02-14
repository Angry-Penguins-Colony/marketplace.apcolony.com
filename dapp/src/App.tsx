import React, { Suspense } from 'react';
import {
  TransactionsToastList,
  SignTransactionsModals,
  NotificationModal
} from '@elrondnetwork/dapp-core/UI';
import { DappProvider } from '@elrondnetwork/dapp-core/wrappers';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Layout from 'components/Layout';
import { environment } from 'config';
import Admin from 'pages/Admin';
import { tools } from 'pages/Admin/tools';
import { CurrentDropsList, DropsListPage, ClosedDropsList } from 'pages/DropsListPage';
import CategoriesOffers from 'pages/GenericOfferListPage';
import Home from 'pages/Home';
import PageNotFound from 'pages/PageNotFound';
import { PenguinsOffersListPage } from 'pages/PenguinsOffersListPage';
import UnlockModal from 'pages/UnlockModal';
import routes, { routeNames } from 'routes';
import { ItemsList } from 'tabs/ItemsList';
import { OffersList } from 'tabs/OffersList';
import { RanksList } from 'tabs/RanksList';
import 'react-tooltip/dist/react-tooltip.css'

const App = () => {
  return <>
    <SkeletonTheme baseColor="#d3d3d3" highlightColor="#e9eef2">


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


                <Route path={routeNames.penguinsHome} element={<PenguinsOffersListPage />}>
                  <Route index element={<Navigate to="offers" replace />} />
                  <Route path="offers" element={<OffersList category="penguins" showFilter />} />
                  <Route path="ranks" element={<RanksList category="penguins" />} />
                </Route>

                <Route path={routeNames.itemsSlotHome} element={<CategoriesOffers category='items' />}>
                  <Route index element={<Navigate to="offers" replace />} />
                  <Route path="offers" element={<OffersList category="items" showFilter />} />
                  <Route path="list" element={<ItemsList />} />
                </Route>

                <Route path={routeNames.eggsHome} element={<CategoriesOffers category='eggs' />}>
                  <Route index element={<Navigate to="offers" replace />} />
                  <Route path="offers" element={<OffersList category="eggs" />} />
                </Route>

                <Route path={routeNames.admin} element={<Admin />}>
                  {tools.map((tool) => (
                    <Route key={tool.route} path={tool.route} element={tool.component} />
                  ))}
                </Route>

                <Route path={routeNames.dropsList} element={<DropsListPage />}>
                  <Route index element={<Navigate to="current" replace />} />
                  <Route path="current" element={<CurrentDropsList />} />
                  <Route path="closed" element={<ClosedDropsList />} />
                </Route>


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
    </SkeletonTheme>
  </>;
};

export default App;