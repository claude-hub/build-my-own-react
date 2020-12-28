import React, { PureComponent } from 'react';
import matchPath from './matchPath';
import { RouterContext } from './Context';

class Switch extends PureComponent {
  render() {
    const { children } = this.props;
    return (
      <RouterContext.Consumer>
        {context => {
          let match = null;
          let element;
          const { location } = context;
          // 获取到children，判断路由是否匹配，匹配到第一个则返回
          React.Children.forEach(children, child => {
            // 这里没有终止循环，是因为源码还加上了其他的一些校验，需要遍历完。
            if (match === null && React.isValidElement(child)) {
              element = child;
              const { path } = child.props;
              match = path ? matchPath(location.pathname, child.props) : context.match;
            }
          });
          // 因为要添加props, 所以用到了cloneElement
          return match ? React.cloneElement(element, {
            // Switch起到独占路由的作用，只会渲染匹配到的Route
            computedMatch: match
          }) : null;
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Switch;