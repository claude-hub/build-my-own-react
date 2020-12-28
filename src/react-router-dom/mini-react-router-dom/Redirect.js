import React, { PureComponent } from 'react';
import { RouterContext } from './Context';
import Lifecycle from './Lifecycle';

export default class Redirect extends PureComponent {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          const { history } = context;
          const { to, push = false } = this.props;
          return (
            <Lifecycle
              onMount={() => {
                // eslint-disable-next-line no-unused-expressions
                push ? history.push(to) : history.replace(to);
              }}
            />
          );
        }}
      </RouterContext.Consumer>
    );
  }
}
