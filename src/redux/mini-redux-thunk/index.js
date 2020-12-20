export default function thunk({ getState, dispatch }) {
  return next => action => {
    // 如果dispatch传入的是一个函数，那么执行这个函数，执行完这个函数后，返回一个函数，就进入回调了
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    return next(action);
  };
}