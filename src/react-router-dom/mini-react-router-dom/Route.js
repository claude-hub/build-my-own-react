/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import matchPath from './matchPath';
import { RouterContext } from './Context';

class Route extends PureComponent {
  render() {
    const {
      children, component, render, path, computedMatch
    } = this.props;
    return (
      <RouterContext.Consumer>
        {context => {
          const { location } = context;
          // const match = location.pathname === path;
          // 如果传入了computedMatch，说明需要Switch独占路由, 优先级高于Route默认的匹配
          const match = computedMatch
          // 如果<Route />参数不写path，就会默认渲染出来 (404的实现)
          || (path ? matchPath(location.pathname, this.props) : context.match);
          const props = {
            ...context,
            match
          };
          // 只实现渲染component
          // return match ? React.createElement(component, props) : null;

          // children有两种写法
          // 1. <Route children={()=>{} /> 2. <Route>{children}</Route>, 所以需要判断类型
          // component写法: <Route component={<Home/>} />
          // render写法: <Route render={()=>{}} />

          // match => 渲染children, component, render, null。 优先级children > component > render
          // no match => children, null。 路由不匹配的时候，如果写法<Route children={} /> children内容就会渲染出来
          //  所以: children和component,render的区别是children不管路由匹不匹配都会渲染出来
          return (
            // hooks API获取context的时候，一直获取到的都是Router层的context，所以这里再包裹一层，就可以获取到最新的context
            <RouterContext.Provider value={props}>
              {
                match
                // 如果路由匹配成功，按照优先级渲染
                  ? (children
                  // 如果存在children，渲染判断children是不是函数，如果是函数则执行函数，否则直接渲染
                    ? (typeof children === 'function' ? children(props) : children)
                  // 不存在children，判断是否存在component，如果component存在，使用createElement创建，
                    : component ? React.createElement(component, props)
                    // 如果component不存在，判断是否存在render，render的写法是一个函数，直接执行该函数，render不存在就返回null
                      : render ? render(props) : null
                  )
                // 如果路由匹配不上，判断children存不存在，如果存在，判断children是不是函数，如果是函数则执行函数，如果不是则直接渲染。
                // （不是函数的情况children写到<Route>{children}</Route>里面）
                  : (typeof children === 'function' ? children(props) : null)
              }
            </RouterContext.Provider>
          );
        }}

      </RouterContext.Consumer>
    );
  }
}

export default Route;