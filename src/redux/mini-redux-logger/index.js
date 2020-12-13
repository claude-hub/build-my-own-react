export default function logger({ getState }) {
  return next => action => {
    console.log('***********************************');
    console.log(`action ${action.type} @ ${new Date().toLocaleString()}`);

    const prevState = getState();
    console.log('prev state', prevState);

    const returnValue = next(action);
    const nextState = getState();
    console.log('next state', nextState);

    console.log('***********************************');
    return returnValue;
  };
}