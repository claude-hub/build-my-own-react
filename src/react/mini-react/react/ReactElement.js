import { TEXT } from './Constant';

function createTextNode(text) {
  return {
    type: TEXT,
    props: {
      children: [],
      nodeValue: text
    }
  };
}

// babel-loader 把jsx语法转为对象，React17中自动处理了这一步.
function createElement(type, config, ...children) {
  let props = {};

  const key = null;
  const ref = null;
  const self = null;
  const source = null;

  if (config != null) {
    delete config.ref;
    delete config.key;
    delete config.__self;
    delete config.__source;
  }

  props = {
    ...props,
    ...config,
    // html节点分为元素节点和文本节点，为方便处理，把节点变为一个类型。
    children: children.map(child => (typeof child === 'object' ? child
      : createTextNode(child)))
  };

  // Resolve default props
  if (type && type.defaultProps) {
    const { defaultProps } = type;
    props = {
      ...props,
      ...defaultProps
    };
  }

  return {
    type,
    props
  };
}

export {
  createElement,
  createTextNode
};