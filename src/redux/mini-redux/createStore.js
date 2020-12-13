export default function createStore(reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }
  let currentState;
  const currentListeners = [];
  function getState() {
    return currentState;
  }

  function dispatch(action) {
    currentState = reducer(currentState, action);
    currentListeners.forEach(listener => listener());
  }

  function subscribe(listener) {
    currentListeners.push(listener);
    // 组件摧毁的时候，需要取消订阅
    return () => {
      currentListeners.filter(item => item !== listener);
    };
  }

  // 初始值
  dispatch({ type: 'REDUX/MIN_REDUX' });

  return {
    getState,
    dispatch,
    subscribe
  };
}