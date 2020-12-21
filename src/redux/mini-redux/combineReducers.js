export default function combineReducers(reducers) {
  return function combination(state = {}, action) {
    const nextState = {};
    let hasChanged = false;
    Object.keys(reducers).forEach(key => {
      const reducer = reducers[key];
      nextState[key] = reducer(state[key], action);
      hasChanged = hasChanged || nextState[key] !== state[key];
    });
    // 源码里面提供了replaceReducer,
    // replaceReducer => {a: 0, b: 1} 替换为了{a: 0}
    // 所以需要比较两次的length发生变化没有
    hasChanged = hasChanged || Object.keys(nextState).length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}