import React, { PureComponent } from 'react';
// import { withRouter } from 'react-router-dom';
import withRouter from '../mini-react-router-dom/withRouter';

class ReactRouterClassPage extends PureComponent {
  render() {
    const { match: { params } } = this.props;
    const { id } = params;
    return (
      <>
        <h2>React Router Page - 函数组件</h2>
        <div>{`路由参数: ${id}`}</div>
      </>
    );
  }
}

export default withRouter(ReactRouterClassPage);