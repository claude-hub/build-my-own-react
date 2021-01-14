import React, { useState } from '../mini-react/react';

function funcComp(props) {
  const { name } = props;
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>{`函数组件 - ${name}`}</p>
      <span>{count}</span>
      <button type="button" onClick={() => setCount(count + 1)}>Add</button>
    </div>
  );
}

export default funcComp;
