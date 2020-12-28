import React, { PureComponent } from 'react';
import { RouterContext } from './Context';
import Lifecycle from './Lifecycle';

function Prompt({ message, when = true }) {
  return (
    <RouterContext.Consumer>
      {context => {
        if (!when) {
          return null;
        }
        const method = context.history.block;
        return (
          <Lifecycle
            onMount={self => {
              // eslint-disable-next-line no-param-reassign
              self.release = method(message);
            }}
            onUnmount={self => {
              self.release();
            }}
          />
        );
      }}
    </RouterContext.Consumer>
  );
}

export default Prompt;