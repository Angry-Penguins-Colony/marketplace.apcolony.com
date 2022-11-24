import React from 'react';
import { RouteType } from '@elrondnetwork/dapp-core/types';
import AuthentificatedPatternRouteWrapper from 'components/Abstract/AuthentificatedPatternRouteWrapper';
import { dAppName } from 'config';
import Inspect from 'pages/Inspect';
import ItemsOffersNavigator from 'pages/ItemsOffersNavigator';
import CategoriesOffers from 'pages/GenericOfferListPage';
import SelectCustomizePenguin from 'pages/SelectCustomizePenguin';
import CategoriesType from 'sdk/types/CategoriesType';
import withPageTitle from './components/PageTitle';
import Customize from './pages/Customize';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import launchpad from './pages/Launchpad';
import Staking from './pages/Staking';
import Transaction from './pages/Transaction';

interface ITitledRoute extends RouteType {
  title?: string,
}

export const routeNames = {
  home: '/',
  transaction: '/transaction',
  inventory: '/inventory/:address',
  inspect: '/inspect/:type/:id',
  customizeInventory: '/customize',
  customize: '/customize/:id',
  penguinsOffers: '/offers/penguins/',
  eggsOffers: '/offers/eggs/',
  itemsOffers: '/offers/items/:slot',
  itemsOffersNavigator: '/offers/items',
  unlock: '/unlock',
  ledger: '/ledger',
  walletconnect: '/walletconnect',
  staking: '/staking',
  launchpad: '/launchpad',
};

export const buildRouteLinks = {
  customize: (id: string | number) => routeNames.customize
    .replace(':id', id.toString()),
  inspect: (type: CategoriesType, id: string) => routeNames.inspect
    .replace(':type', type)
    .replace(':id', id),
  inventory: (address: string) => routeNames.inventory
    .replace(':address', address),
  itemsOffers: (slot: string) => routeNames.itemsOffers
    .replace(':slot', slot),
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
    path: routeNames.customizeInventory,
    title: 'Select a penguin',
    component: () => {
      return <AuthentificatedPatternRouteWrapper unlockRoute={routeNames.unlock}>
        <SelectCustomizePenguin />
      </AuthentificatedPatternRouteWrapper>;
    },
    authenticatedRoute: true,
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
    path: routeNames.itemsOffers,
    title: 'Items Offers',
    component: () => {
      return <CategoriesOffers category='items' />
    }
  },
  {
    path: routeNames.staking,
    title: 'Staking',
    component: Staking
  },
  {
    path: routeNames.launchpad,
    title: 'Launchpad Vente',
    component: launchpad
  },
  {
    path: routeNames.penguinsOffers,
    title: 'Penguins Offers',
    component: () => {
      return <CategoriesOffers category='penguins' />
    }
  },
  {
    path: routeNames.eggsOffers,
    title: 'Eggs Offers',
    component: () => {
      return <CategoriesOffers category='eggs' />
    }
  },
  {
    path: routeNames.itemsOffersNavigator,
    title: 'Items Offers',
    component: ItemsOffersNavigator
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
