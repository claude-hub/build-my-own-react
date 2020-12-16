## React全家桶 - Redux篇

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

### 3.1 合成(compose)

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

### 3.2 柯里化(Currying)

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