import React, {
  useContext, useLayoutEffect, useReducer
} from 'react';
import { bindActionCreators } from '../../redux/mini-redux';

const Context = React.createContext();

export function useStore() {
  return useContext(Context);
}

export function Provider({ store, children }) {
  return <Context.Provider value={store}>{children}</Context.Provider>;
}

// 订阅更新
function subscribeUpdate() {
  const store = useStore();
  const { subscribe } = store;
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  // useLayoutEffect和useEffect, useEffect有延迟, useLayoutEffect无延迟
  useLayoutEffect(() => {
    const unsubscribe = subscribe(() => {
      // store里面的数据发生改变时, 执行订阅
      // 在类组件里面写forceUpdate, 但是函数组件里面没有
      // https://zh-hans.reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
      forceUpdate();
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [store]);
}

export const connect = (
  mapStateToProps = state => state, // 传入了state, 需要返回state
  mapDispatchToProps
) => WrappedComponent => props => {
  const store = useStore();
  const { getState, dispatch } = store;
  const stateProps = mapStateToProps(getState());
  // dispatch支持object | function
  let dispatchProps = { dispatch };
  if (typeof mapDispatchToProps === 'function') {
    dispatchProps = mapDispatchToProps(dispatch);
  } else if (typeof mapDispatchToProps === 'object') {
    dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
  }
  subscribeUpdate();
  return <WrappedComponent {...props} {...stateProps} {...dispatchProps} />;
};

export function useSelector(selector) {
  const store = useStore();
  const { getState } = store;
  const state = getState();
  const selectedState = selector(state);
  // 订阅更新只会定义一次，所以放到useSelector里面
  subscribeUpdate();
  return selectedState;
}

export function useDispatch(params) {
  const store = useStore();
  const { dispatch } = store;
  return dispatch;
}
