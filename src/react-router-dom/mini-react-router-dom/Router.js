import React, { PureComponent } from 'react';
import { RouterContext } from './Context';

class Router extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      location: props.history.location
    };
  }

  componentDidMount() {
    const { history } = this.props;
    // location发生变化的回调
    history.listen(({ location }) => {
      this.setState({ location });
    });
  }

  render() {
    const { children, history } = this.props;
    const { location } = this.state;
    return (
      <RouterContext.Provider
        value={{
          history,
          location
        }}>
        {children}
      </RouterContext.Provider>
    );
  }
}

export default Router;