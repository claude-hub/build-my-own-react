import React, { useState } from '../mini-react/react';

function funcComp(props) {
  const { name } = props;
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>{`函数组件 - ${name}`}</p>
      <span>{count}</span>
      <button type="button" onClick={() => setCount(count + 1)}>Add</button>
      <p>
        <span>
          {count % 2
            ? <button type="button">click</button>
            : <span>1231</span>}
        </span>
      </p>
    </div>
  );
}

export default funcComp;
