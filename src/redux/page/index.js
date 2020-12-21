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

  asyncAdd = () => {
    store.dispatch((dispatch) => {
      setTimeout(() => {
        dispatch({ type: 'ADD' });
      }, 1000);
    });
  }

  minus = () => {
    store.dispatch({ type: 'MINUS' });
  };

  promiseMinus = () => {
    store.dispatch(Promise.resolve({
      type: 'MINUS',
      payload: 1000
    }));
  }

  addTodo = () => {
    store.dispatch({ type: 'ADD_TODO', payload: ' world!' });
  }

  render() {
    return (
      <div style={{ padding: 24 }}>
        <h2>ReduxPage</h2>
        <h4>Count</h4>
        <p>{store.getState().count}</p>
        <button type="button" onClick={this.add}> + add</button>
        <button style={{ margin: '0 8px' }} type="button" onClick={this.asyncAdd}> + async add</button>
        <button type="button" onClick={this.minus}> - minus</button>
        <button style={{ margin: '0 8px' }} type="button" onClick={this.promiseMinus}> - promise minus</button>

        <h4 style={{ marginTop: '24px' }}>Todo</h4>
        <p>{store.getState().todos}</p>
        <button type="button" onClick={this.addTodo}>添加todo</button>
      </div>
    );
  }
}