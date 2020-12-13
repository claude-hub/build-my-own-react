import isPromise from 'is-promise';
import { isFSA } from 'flux-standard-action';

// 简版
// export default function promise({ dispatch }) {
//   return next => action => (isPromise(action) ? action.then(dispatch)
//     : next(action));
// }

export default function promiseMiddleware({ dispatch }) {
  return next => action => {
    if (!isFSA(action)) {
      return isPromise(action) ? action.then(dispatch) : next(action);
    }
    return isPromise(action.payload)
      ? action.payload
        .then(result => dispatch({
          ...action,
          payload: result
        }))
        .catch(error => {
          dispatch({
            ...action,
            payload: error,
            error: true
          });
          return Promise.reject(error);
        })
      : next(action);
  };
}
