import React, { PureComponent } from 'react';
// import { Provider } from 'react-redux';
import { Provider } from '../mini-react-redux/index';
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