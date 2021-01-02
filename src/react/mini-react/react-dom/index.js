// vnode => 虚拟dom
// node => 真实dom

import { TEXT, PIXEL } from '../react/Constant';

// 虚拟dom转化为真实dom
function createNode(vnode) {
  const { type, props } = vnode;
  let node = null;
  if (type === TEXT) {
    node = document.createTextNode('');
  } else if (typeof type === 'string') {
    // div p a 等原生节点
    node = document.createElement(type);
  } else if (typeof type === 'function') {
    // 判断函数组件还是类组件
    node = type.prototype.isReactComponent ? updateClassComponent(vnode)
      : updateFunctionComponent(vnode);
  } else {
    node = document.createDocumentFragment();
  }
  reconcileChildren(props.children, node);

  updateNode(node, props);
  return node;
}

function updateFunctionComponent(vnode) {
  const { type, props } = vnode;
  const vvnode = type(props);
  return createNode(vvnode);
}

function updateClassComponent(vnode) {
  const { type, props } = vnode;
  // eslint-disable-next-line new-cap
  const comp = new type(props);
  const vvnode = comp.render();
  const node = createNode(vvnode);
  return node;
}

// 源码中children可以是单个对象，也可以是数组。我们在createElement中都处理为了数组。
function reconcileChildren(children, node) {
  if (children) {
    children.forEach(child => {
      // 子节点是数组: [1,2].map();
      if (Array.isArray(child)) {
        child.forEach(c => {
          render(c, node);
        });
      } else {
      // 把child插入node中
        render(child, node);
      }
    });
  }
}

// 更新属性值，className，nodeValue
function updateNode(node, nextVal) {
  Object.keys(nextVal).filter(k => k !== 'children').forEach(key => {
    if (key !== 'style') {
      node[key] = nextVal[key];
    } else {
      const style = Object.keys(nextVal[key]).map(k => {
        let value = `${k}: ${nextVal[key][k]}`;
        if ((`${nextVal[key][k]}`).indexOf('px') === -1 && PIXEL.includes(k)) {
          value += 'px';
        }
        return value;
      }).join(';');
      node.setAttribute(key, style);
    }
  });
}

function render(vnode, container) {
  // 1. vnode => node
  const node = createNode(vnode);
  // 2. 把node插入container
  container.appendChild(node);
}

export default { render };