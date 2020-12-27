import React, { PureComponent } from 'react';
import { RouterContext } from './Context';

class Link extends PureComponent {
  // eslint-disable-next-line react/static-property-placement
  static contextType = RouterContext;

  handleClick = (e) => {
    e.preventDefault();
    const { to } = this.props;
    const { history } = this.context;
    history.push(to);
  }

  render() {
    const { to, children, ...rest } = this.props;
    return (
      <a href={to} {...rest} onClick={this.handleClick}>{children}</a>
    );
  }
}

export default Link;