import React, { PureComponent } from 'react';

class HomePage extends PureComponent {
  render() {
    console.log(this.props);
    return (
      <h2>欢迎来到源码世界!</h2>
    );
  }
}

export default HomePage;