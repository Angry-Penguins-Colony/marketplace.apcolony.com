import { dAppName } from 'config';
import ItemInMarketplace from 'pages/Marketplace/ItemInMarketplace/ItemInMarketplace';
import ItemInTypeInMarketplace from 'pages/Marketplace/ItemInTypeInMarketplace/ItemInTypeInMarketplace';
import TypeInMarketplace from 'pages/Marketplace/TypeInMarketplace/TypeInMarketplace';
import withPageTitle from './components/PageTitle';
import Customize from './pages/Customize';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Transaction from './pages/Transaction';

export const routeNames = {
  home: '/',
  transaction: '/transaction',
  inventory: '/inventory',
  customize: '/customize',
  customizeOne: '/customize/:id',
  marketplaceByType: '/marketplace/:type/i/:typeId',
  marketplaceByTypeItem: '/marketplace/:type/i/:typeId/:itemId',
  marketplaceItem: '/marketplace/:type/:id',
  unlock: '/unlock',
  ledger: '/ledger',
  walletconnect: '/walletconnect'
};

const routes: Array<any> = [
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
    path: routeNames.customize,
    title: 'Customize',
    component: Customize
  },
  {
    path: routeNames.customizeOne,
    title: 'Customize',
    component: Customize
  },
  {
    path: routeNames.marketplaceItem,
    title: 'Marketplace',
    component: ItemInMarketplace
  },
  {
    path: routeNames.marketplaceByType,
    title: 'Marketplace',
    component: TypeInMarketplace
  },
  {
    path: routeNames.marketplaceByTypeItem,
    title: 'Marketplace',
    component: ItemInTypeInMarketplace
  },
];

const mappedRoutes = routes.map((route) => {
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
