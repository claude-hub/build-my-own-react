import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class ReactReduxPage extends PureComponent {
  render() {
    const { count, dispatch, add } = this.props;
    return (
      <div style={{ padding: 24 }}>
        <h3>ReactReduxPage</h3>
        <p>{count}</p>
        <button type="button" onClick={() => dispatch({ type: 'ADD' })}>dispatch add</button>
        <button style={{ margin: 8 }} type="button" onClick={add}>add</button>
      </div>
    );
  }
}

// 页面需要哪些数据，取哪些数据
const mapStateToProps = (state) => ({
  count: state.count,
  todos: state.todos
});

// mapDispatchToProps支持两种方式，object | function
// const mapDispatchToProps = {
//   add: () => ({ type: 'ADD' })
// };

const mapDispatchToProps = (dispatch) => {
  let creators = {
    add: () => ({ type: 'ADD' }),
    minus: () => ({ type: 'MINUS' })
  };
  // creators里面没得dispatch，如果一个个的加很麻烦。
  creators = bindActionCreators(creators, dispatch);
  return {
    ...creators,
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReactReduxPage);