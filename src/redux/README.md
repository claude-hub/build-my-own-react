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
      <div style={{ padding: 24 }}>
        <h3>ReduxPage</h3>
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



### 结尾

仓库地址：[https://github.com/claude-hub/build-my-own-react](https://github.com/claude-hub/build-my-own-react)，求star~。

