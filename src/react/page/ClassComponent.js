import React, { Component, Fragment } from '../mini-react/react';

class Test extends Component {
  static defaultProps = {
    color: 'red'
  };

  render() {
    const { name, color } = this.props;
    return (
      <div>
        <p>{`类组件 - ${name}`}</p>
        <p>
          <span>数组: </span>
          {
            ['hello', 'world!'].map(item => <span key={item}>{`${item} `}</span>)
          }
        </p>
        <p>
          <span>{'Fragment与<>: '}</span>
          <span>
            <>{`I am ${'<>'}.`}</>
            <Fragment> I am Fragment.</Fragment>
          </span>
        </p>
        <p>
          <span>defaultProps: </span>
          <span className={color}>red color</span>
        </p>
      </div>
    );
  }
}

export default Test;