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
    props = {
      ...props,
      ...config
    };
  }

  if (children) {
    props = {
      ...props,
      // html节点分为元素节点和文本节点，为方便处理，把节点变为一个类型。
      children: children.map(child => (typeof child === 'object' ? child
        : createTextNode(child)))
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