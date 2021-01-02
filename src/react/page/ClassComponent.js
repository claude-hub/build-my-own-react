import React, { Component } from '../mini-react/react';

// eslint-disable-next-line react/prefer-stateless-function
class Test extends Component {
  render() {
    const { name } = this.props;
    return (
      <div>
        <div>{`类组件 - ${name}`}</div>
        {
          [1, 2].map(item => <div key={item}>{item}</div>)
        }
        <>
          <div>a</div>
          <div>b</div>
        </>
      </div>
    );
  }
}

export default Test;