import HomePage from './HomePage';
import _404Page from './404';
import ReactRouterClassPage from './ReactRouterClassPage';
import ReactRouterHooksPage from './ReactRouterHooksPage';

function ReactRouterPage(props) {
  return (
    <>
      <ReactRouterClassPage {...props} />
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