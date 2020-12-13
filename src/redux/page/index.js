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

  render() {
    return (
      <div style={{ padding: 24 }}>
        <h3>ReduxPage</h3>
        <p>{store.getState()}</p>
        <button type="button" onClick={this.add}> + add</button>
        <button style={{ margin: '0 8px' }} type="button" onClick={this.asyncAdd}> + async add</button>
        <button type="button" onClick={this.minus}> - minus</button>
        <button style={{ margin: '0 8px' }} type="button" onClick={this.promiseMinus}> - promise minus</button>
      </div>
    );
  }
}