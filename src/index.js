import React from 'react';
import ReactDOM from 'react-dom';
import MiniReactDOM from './react/mini-react/react-dom';
// import {
//   BrowserRouter as Router,
//   Route,
//   Link,
//   Switch,
//   useRouteMatch,
//   useHistory,
//   useLocation,
//   useParams,
//   withRouter,
//   Prompt
// } from 'react-router-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from './react-router-dom/mini-react-router-dom';
import './index.css';
// import { Provider } from 'react-redux';
import { Provider } from './react-redux/mini-react-redux';
import ReactPage from './react/page';
import ReduxPage from './redux/page';
import ReactReduxPage from './react-redux/page';
import {
  HomePage, _404Page, ReactRouterPage, RedirectPage, PromptPage
} from './react-router-dom/page';
import store from './redux/store';

function ReactRedux() {
  return (
    <Provider store={store}>
      <ReactReduxPage />
    </Provider>
  );
}

function renderByChildren() {
  return (<div>children</div>);
}

function renderByRender() {
  return (<div>render</div>);
}

ReactDOM.render(
  <React.StrictMode>
    <div style={{ padding: 24 }}>
      <Router>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/redux">Redux</Link>
          <Link to="/react-redux">React Redux</Link>
          <Link to="/react-router/123">React Router</Link>
          <Link to="/redirect">Redirect</Link>
          <Link to="/prompt">Prompt</Link>
          <Link to="/404">404</Link>
        </nav>
        {/* switch独占路由，只会匹配一个 */}
        <Switch>
          <Route
            exact
            path="/"
            // 优先级: children > component > render
            // children特性，不管路由匹不匹配都会渲染，但是这里有switch，只会匹配到一个Route
            // children={renderByChildren}
            component={HomePage}
            // render={renderByRender}
          />
          <Route path="/redux" component={ReduxPage} />
          <Route path="/react-redux" component={ReactRedux} />
          <Route path="/react-router/:id" component={ReactRouterPage} />
          <Route path="/redirect" component={RedirectPage} />
          <Route path="/prompt" component={PromptPage} />
          {/* 如果不写path会默认渲染，但是加上了switch就不会渲染了 */}
          <Route component={_404Page} />
        </Switch>
      </Router>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

MiniReactDOM.render(<ReactPage />, document.getElementById('react'));
