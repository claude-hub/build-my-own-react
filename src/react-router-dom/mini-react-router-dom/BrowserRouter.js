import React, { PureComponent } from 'react';
import { createBrowserHistory } from 'history';
import Router from './Router';

class BrowserRouter extends PureComponent {
  constructor(props) {
    super(props);
    this.history = createBrowserHistory();
  }

  render() {
    const { children } = this.props;
    return (
      <Router history={this.history}>{children}</Router>
    );
  }
}

export default BrowserRouter;