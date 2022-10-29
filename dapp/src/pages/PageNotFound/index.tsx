import * as React from 'react';
import ErrorPage from 'components/ErrorPage';

const PageNotFound = () => {

  return <ErrorPage
    title='Error 404'
    description='Oops a problem just happened'
  />
};

export default PageNotFound;
