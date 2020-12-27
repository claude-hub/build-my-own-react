import React, { PureComponent } from 'react';
import { matchPath } from 'react-router-dom';
import { RouterContext } from './Context';

class Route extends PureComponent {
  render() {
    const {
      children, component, render, path
    } = this.props;
    return (
      <RouterContext.Consumer>
        {context => {
          const { location } = context;
          // const match = location.pathname === path;
          // 精确匹配
          const match = matchPath(location.pathname, this.props);
          return match ? React.createElement(component) : null;
        }}

      </RouterContext.Consumer>
    );
  }
}

export default Route;