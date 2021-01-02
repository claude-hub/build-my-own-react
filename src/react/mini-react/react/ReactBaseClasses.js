function Component(props, context, updater) {
  this.props = props;
}

function PureComponent() {

}

Component.prototype.isReactComponent = {};

export {
  Component,
  PureComponent
};