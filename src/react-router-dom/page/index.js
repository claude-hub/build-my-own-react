import HomePage from './HomePage';
import _404Page from './404';
import ReactRouterClassPage from './ReactRouterClassPage';
import ReactRouterHooksPage from './ReactRouterHooksPage';

function ReactRouterPage(props) {
  return (
    <>
      {/* <ReactRouterClassPage {...props} /> */}
      {/* 这里可以把props传递下去，也可以不传递，使用withRouter高阶组件 */}
      <ReactRouterClassPage />
      {/* 不用传递props, 使用hook方法获取 */}
      <ReactRouterHooksPage />
    </>
  );
}

export {
  HomePage,
  _404Page,
  ReactRouterPage
};