import React from '../mini-react/react';

function funcComp(props) {
  const { name } = props;
  return (
    <div>
      <div>{`函数组件 - ${name}`}</div>
    </div>
  );
}

export default funcComp;
