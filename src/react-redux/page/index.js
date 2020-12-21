import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import ReactReduxPage from './ReactReduxPage';

class Page extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <ReactReduxPage />
      </Provider>
    );
  }
}

export default Page;