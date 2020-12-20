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