import React, { PureComponent } from 'react';
import { Redirect } from '../mini-react-router-dom';

class RedirectPage extends PureComponent {
  render() {
    return (
      <Redirect
        to={{
          pathname: '/'
        }}
      />
    );
  }
}

export default RedirectPage;
