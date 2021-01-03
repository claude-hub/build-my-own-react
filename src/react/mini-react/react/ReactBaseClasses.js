function Component(props, context, updater) {
  this.props = props;
}

function PureComponent() {

}

// class组件加上这个标志，用户判断是函数组件还是class组件
Component.prototype.isReactComponent = {};

export {
  Component,
  PureComponent
};