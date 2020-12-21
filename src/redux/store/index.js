// import { applyMiddleware, createStore, combineReducers } from 'redux';
// import logger from 'redux-logger';
// import thunk from 'redux-thunk';
// import promise from 'redux-promise';

import { createStore, applyMiddleware, combineReducers } from '../mini-redux';
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

function todoReducer(state = ['hello'], action) {
  switch (action.type) {
  case 'ADD_TODO':
    return state.concat([action.payload]);
  default:
    return state;
  }
}

// 只有一个reducer
// const store = createStore(countReducer, applyMiddleware(thunk, logger, promise));

// 多个reducer合并
const store = createStore(
  combineReducers({
    count: countReducer,
    todos: todoReducer
  }),
  applyMiddleware(thunk, logger, promise)
);

export default store;
