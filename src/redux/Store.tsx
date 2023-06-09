import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import RootReducers from './RootReducers';

export function configureStore(InitialState) {
  const Store = createStore(
    RootReducers,
    InitialState,
    composeWithDevTools(applyMiddleware(thunk)),
  );
  return Store;
}
