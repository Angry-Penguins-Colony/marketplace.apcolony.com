import React from 'react';
import { RouteType } from '@elrondnetwork/dapp-core/types';
import AuthentificatedPatternRouteWrapper from 'components/Abstract/AuthentificatedPatternRouteWrapper';
import { dAppName } from 'config';
import CategoriesOffers from 'pages/CategoriesOffers';
import NoPenguinCustomizeError from 'pages/Errors/Customize/NoPenguin';
import Inspect from 'pages/Inspect';
import CategoriesType from 'sdk/types/CategoriesType';
import withPageTitle from './components/PageTitle';
import Customize from './pages/Customize';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Launchpad from './pages/Launchpad';
import Transaction from './pages/Transaction';

interface ITitledRoute extends RouteType {
  title?: string,
}

export const routeNames = {
  home: '/',
  transaction: '/transaction',
  inventory: '/inventory/:address',
  inspect: '/inspect/:type/:id',
  customize: '/customize/:id',
  categoriesOffers: '/offers/:category/',
  unlock: '/unlock',
  ledger: '/ledger',
  walletconnect: '/walletconnect',
  launchpad: '/launchpad',
  errors: {
    customize: {
      noPenguin: '/error/customize/nopenguin'
    }
  }
};

export const buildRouteLinks = {
  customize: (id: string | number) => routeNames.customize.replace(':id', id.toString()),
  inspect: (type: CategoriesType, id: string) => routeNames.inspect.replace(':type', type).replace(':id', id),
  inventory: (address: string) => routeNames.inventory.replace(':address', address),
  categoriesOffers: (type: string) => routeNames.categoriesOffers.replace(':category', type)
}

const routes: Array<ITitledRoute> = [
  {
    path: routeNames.home,
    title: 'Home',
    component: Home
  },
  {
    path: routeNames.transaction,
    title: 'Transaction',
    component: Transaction
  },
  {
    path: routeNames.inventory,
    title: 'Inventory',
    component: Inventory
  },
  {
    path: routeNames.inspect,
    title: 'Inspect',
    component: Inspect
  },
  {
    path: routeNames.customize,
    title: 'Customize',
    component: () => {
      return <AuthentificatedPatternRouteWrapper unlockRoute={routeNames.unlock}>
        <Customize />
      </AuthentificatedPatternRouteWrapper>;
    },
    authenticatedRoute: true,
  },
  {
    path: routeNames.categoriesOffers,
    title: 'Offers',
    component: CategoriesOffers
  },
  {
    path: routeNames.launchpad,
    title: 'Launchpad',
    component: Launchpad
  },
  {
    path: routeNames.errors.customize.noPenguin,
    title: 'No penguin to customize',
    component: NoPenguinCustomizeError
  }
];

const mappedRoutes: ITitledRoute[] = routes.map((route) => {
  const title = route.title
    ? `${route.title} • ${dAppName}`
    : `${dAppName}`;

  const requiresAuth = Boolean(route.authenticatedRoute);
  const wrappedComponent = withPageTitle(title, route.component);

  return {
    path: route.path,
    component: wrappedComponent,
    authenticatedRoute: requiresAuth
  };
});

export default mappedRoutes;
