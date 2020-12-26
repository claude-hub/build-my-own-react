import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import ReduxPage from './redux/page';
import ReactReduxPage from './react-redux/page';
import store from './redux/store';
import { Provider } from './react-redux/mini-react-redux';

ReactDOM.render(
  <React.StrictMode>
    <ReduxPage />
    <Provider store={store}>
      <ReactReduxPage />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
