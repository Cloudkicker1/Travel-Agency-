import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createReduxStore } from './store';
import { Provider } from 'react-redux';

const store = createReduxStore();

export function getState() {
  return store.getState();
};

export function getDispatch() {
  return store.dispatch;
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
