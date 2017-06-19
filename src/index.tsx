import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import { createStore } from 'redux';
import { enthusiasm } from './View/reducers/index';
import { StoreState, PlayerState } from './View/types/index';

// tslint:disable-next-line:no-any
var w: any = window;

const store = createStore<StoreState>(
  enthusiasm, {
    state: PlayerState.Playing,
    volume: 1
  },
  w.__REDUX_DEVTOOLS_EXTENSION__ && w.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
