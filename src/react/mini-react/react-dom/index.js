// vnode => 虚拟dom
// node => 真实dom

import { TEXT, PIXEL, PLACEMENT } from '../react/Constant';

// 下一个单元任务 => fiber
let nextUnitOfWork = null;
// work in progress fiber root => 正在执行的根fiber
let wipRoot = null;

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
  // reconcileChildren(props.children, node);

  updateNode(node, props);
  return node;
}

// function updateFunctionComponent(vnode) {
//   const { type, props } = vnode;
//   const vvnode = type(props);
//   return createNode(vvnode);
// }

function updateFunctionComponent(fiber) {
  const { type, props } = fiber;
  const vvnode = type(props);
  const children = Array.isArray(vvnode) ? [...vvnode] : [vvnode];
  reconcileChildren(fiber, children);
}

// function updateClassComponent(vnode) {
//   const { type, props } = vnode;
//   // eslint-disable-next-line new-cap
//   const comp = new type(props);
//   const vvnode = comp.render();
//   const node = createNode(vvnode);
//   return node;
// }

function updateClassComponent(fiber) {
  const { type, props } = fiber;
  // eslint-disable-next-line new-cap
  const comp = new type(props);
  const vvnode = comp.render();
  const children = Array.isArray(vvnode) ? [...vvnode] : [vvnode];
  reconcileChildren(fiber, children);
}

// // 源码中children可以是单个对象，也可以是数组。我们在createElement中都处理为了数组。
// function reconcileChildren(children, node) {
//   if (children) {
//     children.forEach(child => {
//       // 子节点是数组: [1,2].map();
//       if (Array.isArray(child)) {
//         child.forEach(c => {
//           render(c, node);
//         });
//       } else {
//       // 把child插入node中
//         render(child, node);
//       }
//     });
//   }
// }

/**
 * fiber架构
 * key: 标记当前层级下的唯一性
 * type: 类型=> 原生节点, function, class
 * child: 第一个子元素
 * sibling: 下一个兄弟元素
 * return: 父fiber
 * node: 真实dom节点
 * props: 属性值
 * base: 上次的节点, 新旧dom比较的时候, 存上一次的dom
 * effectTag: 标记执行的操作类型 (删除, 插入, 更新)
 */
function reconcileChildren(workInProgressFiber, children) {
  // 构建fiber架构
  let prevSibling = null;
  children.forEach((child, index) => {
    if (Array.isArray(child)) {
      child.forEach((c, i) => {
        const newFiber = baseFiber(c, workInProgressFiber);
        if (i === 0) {
          workInProgressFiber.child = newFiber;
        } else {
          prevSibling.sibling = newFiber;
        }
        prevSibling = newFiber;
      });
    } else {
      const newFiber = baseFiber(child, workInProgressFiber);
      if (index === 0) {
        workInProgressFiber.child = newFiber;
      } else {
        prevSibling.sibling = newFiber;
      }
      prevSibling = newFiber;
    }
  });
}

function baseFiber(child, workInProgressFiber) {
  return {
    type: child.type,
    props: child.props,
    node: null,
    base: null,
    return: workInProgressFiber,
    effectTag: PLACEMENT
  };
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

// function render(vnode, container) {
//   // 1. vnode => node
//   const node = createNode(vnode);
//   // 2. 把node插入container
//   container.appendChild(node);
// }

function render(vnode, container) {
  // vnode有可能是数组 (1,2).map()
  wipRoot = {
    node: container,
    props: {
      children: Array.isArray(vnode) ? [...vnode] : [vnode]
    }
  };
  nextUnitOfWork = wipRoot;
}

function updateHostComponent(fiber) {
  if (!fiber.node) {
    fiber.node = createNode(fiber);
  }
  // 协调子元素
  const { children } = fiber.props;
  reconcileChildren(fiber, children);
}

function performUnitOfWork(fiber) {
  // 执行当前任务，并返回下一个子任务（fiber）
  const { type } = fiber;
  if (typeof type === 'function') {
    // class | function
    // 判断函数组件还是类组件
    if (type.prototype.isReactComponent) {
      updateClassComponent(fiber);
    } else {
      updateFunctionComponent(fiber);
    }
  } else {
    // 原生标签
    updateHostComponent(fiber);
  }

  // 获取下一个子任务
  if (fiber.child) {
    return fiber.child;
  }

  // 如果没有child，那就找兄弟
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    // 如果没有兄弟，那就找父节点的兄弟。return返回的是当前fiber的父节点。
    // 返回的当前fiber的父节点后，继续执行循环，就找的是当前fiber的兄弟了
    nextFiber = nextFiber.return;
  }
  return null;
}

function workLook(deadline) {
  // 有下一个任务 并且当前帧没有结束
  // 这里的时间是模拟，源码当中用的过期时间，源码中的过期时间和时间单位相关内
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    // 执行当前任务，并返回下一个子任务（fiber）
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (!nextUnitOfWork && wipRoot) {
    // 提交
    commitRoot();
  }
  requestIdleCallback(workLook);
}

function commitRoot() {
  // 最外层是container为#root没必要提交
  commitWorker(wipRoot.child);
  wipRoot = null;
}

function commitWorker(fiber) {
  if (!fiber) {
    return;
  }
  // 找到最近的有node的祖先fiber, 有些标签如Fragment没有真实dom
  let parentNodeFiber = fiber.return;
  while (!parentNodeFiber.node) {
    parentNodeFiber = parentNodeFiber.return;
  }
  const parentNode = parentNodeFiber.node;
  // 新增
  if (fiber.effectTag === PLACEMENT && fiber.node != null) {
    parentNode.appendChild(fiber.node);
  }
  // 更新子元素
  commitWorker(fiber.child);
  // 更新兄弟元素
  commitWorker(fiber.sibling);
}

requestIdleCallback(workLook);

export default { render };