import React from 'react';
import ReactReduxPage from './ReactReduxPage';
import ReactReduxHooksPage from './ReactReduxHooksPage';

export default function Page(params) {
  return (
    <div>
      <ReactReduxPage />
      <ReactReduxHooksPage />
    </div>
  );
}