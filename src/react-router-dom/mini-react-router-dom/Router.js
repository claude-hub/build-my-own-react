import React, { PureComponent } from 'react';
import { RouterContext } from './Context';

class Router extends PureComponent {
  static computeRootMatch(pathname) {
    return {
      path: '/', url: '/', params: {}, isExact: pathname === '/'
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      location: props.history.location
    };
  }

  componentDidMount() {
    const { history } = this.props;
    // location发生变化的回调
    this.unsubscribe = history.listen(({ location }) => {
      this.setState({ location });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const { children, history } = this.props;
    const { location } = this.state;
    return (
      <RouterContext.Provider
        value={{
          history,
          location,
          match: Router.computeRootMatch(location.pathname)
        }}>
        {children}
      </RouterContext.Provider>
    );
  }
}

export default Router;