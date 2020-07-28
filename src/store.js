import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import loginReducer from "./reducers/login";

let createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);
export const storeInstance = createStoreWithMiddleware(loginReducer);
