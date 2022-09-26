import { dAppName } from 'config';
import CategoriesOffers from 'pages/CategoriesOffers';
import Inspect from 'pages/Inspect';
import CategoriesType from 'sdk/types/CategoriesType';
import withPageTitle from './components/PageTitle';
import Customize from './pages/Customize';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Transaction from './pages/Transaction';

export const routeNames = {
  home: '/',
  transaction: '/transaction',
  inventory: '/inventory/:address',
  inspect: '/inspect/:type/:id',
  customize: '/customize',
  customizeOne: '/customize/:id',
  categoriesOffers: '/offers/:type/',
  unlock: '/unlock',
  ledger: '/ledger',
  walletconnect: '/walletconnect'
};

export const buildRouteLinks = {
  customize: (id: string | number) => routeNames.customizeOne.replace(':id', id.toString()),
  inspect: (type: CategoriesType, id: string) => routeNames.inspect.replace(':type', type).replace(':id', id),
  inventory: (address: string) => routeNames.inventory.replace(':address', address),
  categoriesOffers: (type: string) => routeNames.categoriesOffers.replace(':type', type)
}

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
    path: routeNames.inspect,
    title: 'Inspect',
    component: Inspect
  },
  {
    path: routeNames.customize,
    title: 'Customize',
    component: Customize,
    authenticatedRoute: true
  },
  {
    path: routeNames.customizeOne,
    title: 'Customize',
    component: Customize
  },
  {
    path: routeNames.categoriesOffers,
    title: 'Offers',
    component: CategoriesOffers
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
