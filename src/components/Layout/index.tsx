import React from 'react';
import { AuthenticatedRoutesWrapper } from '@elrondnetwork/dapp-core/wrappers';
import { useLocation } from 'react-router-dom';
import routes, { routeNames } from 'routes';
import Footer from './Footer';
import Navbar from './Navbar/Navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { search } = useLocation();
  return (
    <>
      <Navbar />
      <AuthenticatedRoutesWrapper
        routes={routes}
        unlockRoute={`${routeNames.unlock}${search}`}
      >
        {children}
      </AuthenticatedRoutesWrapper>
      <Footer />
    </>
  );
};

export default Layout;
