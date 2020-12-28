import React, { PureComponent } from 'react';

class LifeCycle extends PureComponent {
  componentDidMount() {
    const { onMount } = this.props;
    if (onMount) {
      onMount.call(this, this);
    }
  }

  componentWillUnmount() {
    const { onUnmount } = this.props;
    if (onUnmount) {
      onUnmount.call(this, this);
    }
  }

  render() {
    return null;
  }
}

export default LifeCycle;
