import React from 'react';
// import {
//   useRouteMatch,
//   useHistory,
//   useLocation,
//   useParams
// } from 'react-router-dom';
import {
  useRouteMatch,
  useHistory,
  useLocation,
  useParams
} from '../mini-react-router-dom/hooks';

export default function ReactRouterHooksPage() {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  console.log('hooks获取参数, history: ', history);
  console.log('hooks获取参数, location: ', location);
  console.log('hooks获取参数, match: ', match);
  console.log('hooks获取参数, params: ', params);
  return (
    <>
      <h2>React Router Page - Hooks</h2>
      <p>useRouteMatch, useHistory, useLocation, useParams</p>
      <p>打开控制台，查看参数</p>
    </>
  );
}