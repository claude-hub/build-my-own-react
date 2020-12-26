import React, {
  useContext, useLayoutEffect, useReducer
} from 'react';
import { bindActionCreators } from '../../redux/mini-redux';

const Context = React.createContext();

export function Provider({ store, children }) {
  return <Context.Provider value={store}>{children}</Context.Provider>;
}

export const connect = (
  mapStateToProps = state => state, // 传入了state, 需要返回state
  mapDispatchToProps
) => WrappedComponent => props => {
  const store = useContext(Context);
  const { getState, dispatch, subscribe } = store;
  const stateProps = mapStateToProps(getState());
  // dispatch支持object | function
  let dispatchProps = { dispatch };
  if (typeof mapDispatchToProps === 'function') {
    dispatchProps = mapDispatchToProps(dispatch);
  } else if (typeof mapDispatchToProps === 'object') {
    dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
  }

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

  return <WrappedComponent {...props} {...stateProps} {...dispatchProps} />;
};
