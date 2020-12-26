import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export default function ReduxHooksPage(props) {
  // eslint-disable-next-line no-shadow
  const count = useSelector(({ count }) => count);
  const dispatch = useDispatch();
  const add = useCallback(() => {
    dispatch({ type: 'ADD' });
  }, []);
  return (
    <div>
      <h3>React Redux Page - Hooks</h3>
      <p>{count}</p>
      <button type="button" onClick={add}>add</button>
    </div>
  );
}