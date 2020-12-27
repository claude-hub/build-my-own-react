import React, { useCallback } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import { useSelector, useDispatch } from '../mini-react-redux';

export default function ReduxHooksPage(props) {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();
  const add = useCallback(() => {
    dispatch({ type: 'ADD' });
  }, []);
  return (
    <div>
      <h2>React Redux Page - Hooks</h2>
      <p>{count}</p>
      <button type="button" onClick={add}>add</button>
    </div>
  );
}