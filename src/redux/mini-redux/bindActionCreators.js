function bindActionCreator(actionCreator, dispatch) {
  return (...args) => dispatch(actionCreator(...args));
}

// 用法，给creators添加dispatch
// let creators = {
//   add: () => ({ type: 'ADD' }),
//   minus: () => ({ type: 'MINUS' })
// };
// creators = bindActionCreators(creators, dispatch);
export default function bindActionCreators(actionCreators, dispatch) {
  const boundActionCreators = {};
  Object.keys(actionCreators).forEach(key => {
    const actionCreator = actionCreators[key];
    boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
  });
}
