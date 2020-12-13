import compose from './compose';

export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args);
    let { dispatch } = store;

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...params) => dispatch(...params)
    };
    const chain = middlewares.map(middleware => middleware(middlewareAPI));

    dispatch = compose(...chain)(store.dispatch);
    return {
      ...store,
      // 返回封装后的dispatch
      dispatch
    };
  };
}