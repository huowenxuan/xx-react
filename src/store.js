import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import promise from 'redux-promise'
import logger from "redux-logger";
import * as reducers from './reducers'

export default createStore(
  combineReducers(reducers),
  applyMiddleware(thunk, promise, logger)
)
