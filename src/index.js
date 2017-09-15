import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import * as reducers from './reducers'
import Root from './root'
import { createStore } from 'redux'
import { combineReducers } from 'redux'

const Reducers = combineReducers({
  ...reducers,
});

const store = createStore(
  Reducers
)

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
)

registerServiceWorker()
