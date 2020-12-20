import compose from './compose';

export default function applyMiddleware(...middlewares) {
  // createStore就是我们实现的createStore函数，支持两个参数，一个参数是reducer，第二个参数是enhancer
  // args就是我们执行第二个参数enhancer时传入参数 => reducer, 这里具体的就是countReducer
  return createStore => (...args) => {
    // 柯里化，执行一下只传入第一个参数的createStore，我们就获取到了store，store里面有dispatch
    const store = createStore(...args);
    let { dispatch } = store;
    // 获取到dispatch后，我们需要对它进行增强
    const middlewareAPI = {
      getState: store.getState,
      // dispatch原本有哪些参数，都传进去
      dispatch: (...params) => dispatch(...params)
    };
    // 传入每个中间件都需要的getState和需要加强的dispatch
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    // 执行每一个中间件就ok了，利用到了我们上面写的compose函数。
    // 这里有点绕，需要弄懂compose函数，到底在干啥。
    // applyMiddleware(thunk, logger, promise)使用的时候，我们传入了3个中间件
    // 使用compose => thunk(logger(promise(dispatch)))
    // 第一次执行promise，返回一个回调函数， 第二次执行logger同样返回一个回调函数，最后执行完thunk时，才会执行外部的真正的回调函数
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      // 返回增强后的dispatch
      dispatch
    };
  };
}