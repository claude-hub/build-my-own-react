import React, { Component } from 'react';
import store from '../store';

export default class ReduxPage extends Component {
  // 如果点击按钮不能更新，查看是否订阅(subscribe)状态变更。
  componentDidMount() {
    store.subscribe(() => {
      this.forceUpdate();
    });
  }

  add = () => {
    store.dispatch({ type: 'ADD' });
  };

  minus = () => {
    store.dispatch({ type: 'MINUS' });
  };

  render() {
    console.log('store', store);
    return (
      <div style={{ padding: 24 }}>
        <h3>ReduxPage</h3>
        <p>{store.getState()}</p>
        <button style={{ marginRight: 8 }} type="button" onClick={this.add}> + add</button>
        <button type="button" onClick={this.minus}> - minus</button>
      </div>
    );
  }
}