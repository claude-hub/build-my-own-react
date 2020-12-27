import React from 'react';
import { RouterContext } from './Context';

const withRouter = WrappedComponent => props => (
  <RouterContext.Consumer>
    {context => <WrappedComponent {...props} {...context} />}
  </RouterContext.Consumer>
);

export default withRouter;
