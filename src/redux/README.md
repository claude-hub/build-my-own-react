## React全家桶 - Redux篇

![](https://cdn.jsdelivr.net/gh/claude-hub/cloud-img/2020/20201219172440.png)

[中文文档](https://www.redux.org.cn/)

### 1. 功能列表

- [x] createStore 创建store
- [x] reducer 初始化、修改状态函数
- [x] getState 获取状态值
- [x] dispatch 提交更新
- [x] subscribe 变更订阅
- [x] applyMiddleware 支持中间件

### 2. 中间件

- [x] mini-redux-thunk           异步
- [x] mini-redux-logger          日志
- [x] mini-redux-promise         支持promise

### 3. 函数式编程

推荐资源：

[函数式编程入门教程 - 阮一峰的网络日志 (ruanyifeng.com)](http://www.ruanyifeng.com/blog/2017/02/fp-tutorial.html)

[第 1 章: 我们在做什么？ · 函数式编程指北 (gitbooks.io)](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch1.html)

两个最基本的运算：合成（compose）和柯里化（Currying）

#### 3.1 合成(compose)

如果一个值要经过多个函数，才能变成另外一个值，就可以把所有中间步骤合并成一个函数，这叫做"函数的合成"（compose）

```javascript
function fun1(arg) {
  return arg + 1;
}

function fun2(arg) {
  return arg + 2;
}

function fun3(arg) {
  return arg + 3;
}

function compose(...funcs) {
  if (funcs.length === 0) {
    // 返回一个匿名函数，然后再对匿名函数进行执行, ()()
    // arg: 调用compose传入的参数，如: compose()(1)
    return arg => arg;
  }
  if (funcs.length === 1) {
    // 返回函数
    return funcs[0];
  }
  // 利用reduce
  return funcs.reduce((f1, f2) => (...args) => f1(f2(...args)));
}

const result = compose(fun1, fun2, fun3)(0); // fun1(fun2(fun3(0)))

console.log(result) // 0+1+2+3
```

#### 3.2 柯里化(Currying)

`fun1(x)` 和 `fun2(x)` 要合并为一个函数`fun1(fun2(x))`，有一个前提是`fun1`和`fun2`都只有一个参数，那么如果可以接受多个参数，`fun1(x, y)` 和 `fun2(x, y, z)`，函数合并就比价麻烦了。

"柯里化"，就是把一个多参数的函数，转化为单参数函数。有了柯里化以后，我们就能做到，所有函数只接受一个参数。

```javascript
// 柯里化之前
function add(x, y) {
  return x + y;
}

add(1, 2) // 3

// 柯里化之后
function addX(y) {
  return function (x) {
    return x + y;
  };
}

addX(2)(1) // 3
```

### 4. mini版实现

#### 4.1 通过原库实现

思路：先使用一个简单的页面，使用Redux和React搭建起来，然后再自己实现对应的函数。

**page**

```javascript
import React, { Component } from 'react';
import store from '../store';

export default class ReduxPage extends Component {
  // 如果点击按钮不能更新，查看是否订阅(subscribe)状态变更。
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  add = () => {
    store.dispatch({ type: 'ADD' });
  };

  minus = () => {
    store.dispatch({ type: 'MINUS' });
  };

  render() {
    return (
      <div>
        <h3>Redux Page</h3>
        <p>{store.getState()}</p>
        <button type="button" onClick={this.add}> + add</button>
        <button type="button" onClick={this.minus}> - minus</button>
      </div>
    );
  }
}
```

**store**

```javascript
import { createStore } from 'redux';

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

const store = createStore(countReducer);

export default store;

```

**效果**

![](https://cdn.jsdelivr.net/gh/claude-hub/cloud-img/2020/20201219162816.gif)

#### 4.2 分析

点击按钮 => 执行store.dispatch函数 (参数只能支持对象) => store由redux的countReducer方法创建 (参数就是我们定义的reducer纯函数) => 页面通过store.getState()获取到store的数据 => 想要页面更新，必须使用store.subscribe订阅状态变更 => store数据改变后会触发subscribe，然后页面调用forceUpdate就更新页面了

总结：redux需要下面的函数

1. dispatch 提交更新
2. createStore 创建store
3. getState 获取状态值
4. subscribe 变更订阅

#### 4.3 createStore

调用这个函数返回store，store里面包含dispatch，subscribe，getState

```javascript
// function countReducer(state = 0, action) {
//   switch (action.type) {
//   case 'ADD':
//     return state + 1;
//   case 'MINUS':
//     return state - 1;
//   default:
//     return state;
//   }
// }
// const store = createStore(countReducer); 传入了定义的reducer
export default function createStore(reducer) {
  let currentState;
  const currentListeners = [];
  function getState() {
    return currentState;
  }

  // store.dispatch({ type: 'ADD' }); 传入了一个action
  function dispatch(action) {
    // 执行一下reducer
    currentState = reducer(currentState, action);
    // 数据更新后，把所有的listener执行一遍
    currentListeners.forEach(listener => listener());
  }

  // 传入了一个回调函数，数据更新了，就执行这个回调
  function subscribe(listener) {
    currentListeners.push(listener);
    // 组件摧毁的时候，需要取消订阅
    return () => {
      currentListeners.filter(item => item !== listener);
    };
  }

  // 初始值，手动发一个dispatch，为避免和用户创建的一样，源码里面采用了随机字符串。
  dispatch({ type: 'REDUX/MIN_REDUX' });

  return {
    subscribe,
    getState,
    dispatch
  };
}
```

然后把咋们store里面引入redux的位置替换为我们的createStore就完成了。

>  import { createStore } from 'redux'; // 替换下store中createStore函数路径

### 5. 中间件

[异步数据流](https://www.redux.org.cn/docs/advanced/AsyncFlow.html)

默认情况下，[`createStore()`](https://www.redux.org.cn/docs/api/createStore.html) 所创建的 Redux store 没有使用 [middleware](https://www.redux.org.cn/docs/advanced/Middleware.html)，所以只支持 [同步数据流](https://www.redux.org.cn/docs/basics/DataFlow.html)。

你可以使用 [`applyMiddleware()`](https://www.redux.org.cn/docs/api/applyMiddleware.html) 来增强 [`createStore()`](https://www.redux.org.cn/docs/api/createStore.html)。

#### 5.1 使用中间件

咋们在page页里面添加两个按钮并绑定事件

```javascript
asyncAdd = () => {
    store.dispatch((dispatch) => {
        setTimeout(() => {
            dispatch({ type: 'ADD' });
        }, 1000);
    });
}
promiseMinus = () => {
    store.dispatch(Promise.resolve({
        type: 'MINUS',
        payload: 1000
    }));
}

<button style={{ margin: '0 8px' }} type="button" onClick={this.asyncAdd}> + async add</button>

<button style={{ margin: '0 8px' }} type="button" onClick={this.promiseMinus}> - promise minus</button>
```

上面代码中，dispatch中我们传入了一个函数，以及Promise。

在**store**中引入`redux-promise`支持promise,  `redux-thunk`支持异步数据, `redux-logger`打印store数据变更日志。 

```javascript
import { applyMiddleware, createStore } from 'redux';
import promise from 'redux-promise';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const store = createStore(countReducer, applyMiddleware(thunk, logger, promise));
```

效果如下：

![](https://cdn.jsdelivr.net/gh/claude-hub/cloud-img/2020/20201220215542.gif)

#### 5.2 applyMiddleware

由上面的用法，我们可以看出，`applyMiddleware`支持传入多个中间件，作用为增强store的功能，使dispatch支持Promise和异步数据流。

`createStore`函数目前支持两个参数了，但是我们上面写的代码只支持一个参数。添加下面的代码，如果有第二个参数就把第二个参数执行了，我们需要增加store所有传入了参数store，然后执行的时候，需要用到reducer。

```javascript
export default function createStore(reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }
  ......
}
```

**applyMiddleware实现**

```javascript
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
      // disptch原本有哪些参数，都传进去
      dispatch: (...params) => dispatch(...params)
    };
    // 传入每个中间件都需要的getState和需要加强的dispatch
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    // 执行每一个中间件就ok了，利用到了我们上面写的compse函数。
    // 这里有点绕，需要弄懂compose函数，到底在干啥。
    // applyMiddleware(thunk, logger, promise)使用的时候，我们传入了3个中间件
    // 使用compose 等价于 thunk(logger(promise(dispatch)))
    // 第一次执行promise，返回一个回调函数， 第二次执行logger同样返回一个回调函数，最后执行完thunk时，才会执行外部的真正的回调函数
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      // 返回增强后的dispatch
      dispatch
    };
  };
}
```

#### 5.3 redux-logger

先来实现一个最简单的`redux-logger`, 打印store的变化

```javascript
// const chain = middlewares.map(middleware => middleware(middlewareAPI));
// 在上面的代码中，我们传入了middlewareAPI，解构获取到getState
export default function logger({ getState }) {
  // compose聚合函数中，执行reduce的时候，fn1和f2，next就是f1。
  return next => action => {
    console.log('***********************************');
    console.log(`action ${action.type} @ ${new Date().toLocaleString()}`);
    // 执行一下getState()，获取当前的state。
    const prevState = getState();
    console.log('prev state', prevState);

    // 执行dispatch
    const returnValue = next(action);
    // 获取到执行后的state
    const nextState = getState();
    console.log('next state', nextState);

    console.log('***********************************');
    return returnValue;
  };
}
```

#### 5.4 redux-thunk

```javascript
export default function thunk({ getState, dispatch }) {
  return next => action => {
    // 如果dispatch传入的是一个函数，那么执行这个函数，执行完这个函数后，返回一个函数，就进入回调了
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    return next(action);
  };
}
```

#### 5.5 redux-promise

```javascript
import isPromise from 'is-promise';

// 简版
export default function promise({ dispatch }) {
  return next => action => (isPromise(action) ? action.then(dispatch)
    : next(action));
}
```

### 6. combineReducers

项目中不可能只有一个`Reducer`，这个时候就需要`combineReducers`来把所有`Reducer`合并为一个了。

#### 6.1 用法

**page**

```javascript
addTodo = () => {
    store.dispatch({ type: 'ADD_TODO', payload: ' world!' });
}

<h2>Redux Page</h2>
<h4>Count</h4>
<p>{store.getState().count}</p>

<h4 style={{ marginTop: '24px' }}>Todo</h4>
<p>{store.getState().todos}</p>
<button type="button" onClick={this.addTodo}>添加todo</button>
```

**store**

```javascript
import { applyMiddleware, createStore, combineReducers } from 'redux';

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
```

#### 6.2 实现

```javascript
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
```

### 7.bindActionCreator

配合`react-redux`使用，[文档](https://www.redux.org.cn/docs/api/bindActionCreators.html)

**实现**

```javascript
function bindActionCreator(actionCreator, dispatch) {
  return (...args) => dispatch(actionCreator(...args));
}

// 用法，给creators添加dispatch
// let creators = {
//   add: () => ({ type: 'ADD' }),
//   minus: () => ({ type: 'MINUS' })
// };
// creators = bindActionCreators(creators, dispatch);
export default function bindActionCreators(actionCreators, dispatch) {
  const boundActionCreators = {};
  Object.keys(actionCreators).forEach(key => {
    const actionCreator = actionCreators[key];
    boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
  });
}
```
### 结尾

仓库地址：[https://github.com/claude-hub/build-my-own-react](https://github.com/claude-hub/build-my-own-react)，求star~。

