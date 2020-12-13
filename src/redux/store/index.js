// import { applyMiddleware, createStore } from 'redux';
// import logger from 'redux-logger';
// import thunk from 'redux-thunk';
// import promise from 'redux-promise';

import { createStore, applyMiddleware } from '../mini-redux';
import logger from '../mini-redux-logger';
import thunk from '../mini-redux-thunk';
import promise from '../mini-redux-promise';

function countReducer(state = 0, action) {
  switch (action.type) {
  case 'ADD':
    return state + 1;
  case 'MINUS':
    return state - 1;
  default:
    return state;
  }
}

const store = createStore(countReducer, applyMiddleware(thunk, logger, promise));

export default store;
