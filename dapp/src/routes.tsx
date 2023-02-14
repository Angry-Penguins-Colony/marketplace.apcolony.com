import React from 'react';
import { RouteType } from '@elrondnetwork/dapp-core/types';
import AuthentificatedPatternRouteWrapper from 'components/Abstract/AuthentificatedPatternRouteWrapper';
import { dAppName } from 'config';
import AccessoriesList from 'pages/AccessoriesList';
import DropPage from 'pages/DropPage';
import { DropsList } from 'pages/DropsList';
import CategoriesOffers from 'pages/GenericOfferListPage';
import Inspect from 'pages/Inspect';
import ItemsOffersNavigator from 'pages/ItemsOffersNavigator';
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

const listPrefix = 'l';

export const routeNames = {
  home: '/',
  transaction: '/transaction',
  inventory: '/inventory/:address',
  inspect: '/inspect/:type/:id',
  customizeInventory: '/customize',
  customize: '/customize/:id',
  penguinsHome: `/${listPrefix}/penguins/`,
  eggsHome: `/${listPrefix}/eggs/`,
  allItemsHome: `/${listPrefix}/items`,
  itemsSlotHome: `/${listPrefix}/items/:slot`,
  unlock: '/unlock',
  ledger: '/ledger',
  walletconnect: '/walletconnect',
  staking: '/staking',
  launchpad: '/launchpad',
  accessories: '/accessories',
  dropsList: '/drops/list/',
  dropPage: '/drops/drop/:id',
  admin: '/admin',
};

export const buildRouteLinks = {
  customize: (id: string | number) => routeNames.customize
    .replace(':id', id.toString()),
  inspect: (type: CategoriesType, id: string) => routeNames.inspect
    .replace(':type', type)
    .replace(':id', id),
  inventory: (address: string) => routeNames.inventory
    .replace(':address', address),
  itemsOffers: (slot: string) => routeNames.itemsSlotHome
    .replace(':slot', slot),
  dropPage: (dropId: string) => routeNames.dropPage
    .replace(':id', dropId)
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
    path: routeNames.eggsHome,
    title: 'Eggs Offers',
    component: () => {
      return <CategoriesOffers category='eggs' />
    }
  },
  {
    path: routeNames.allItemsHome,
    title: 'Items Offers',
    component: ItemsOffersNavigator
  },
  {
    path: routeNames.accessories,
    title: 'Accessories',
    component: AccessoriesList
  },
  {
    path: routeNames.dropPage,
    title: 'Special Drop',
    component: DropPage
  },
  {
    path: routeNames.dropsList,
    title: 'Drops List',
    component: DropsList,
  }
];

const mappedRoutes: ITitledRoute[] = routes.map((route) => {
  const title = route.title ?? dAppName;

  const requiresAuth = Boolean(route.authenticatedRoute);
  const wrappedComponent = withPageTitle(title, route.component);

  return {
    path: route.path,
    component: wrappedComponent,
    authenticatedRoute: requiresAuth
  };
});

export default mappedRoutes;
