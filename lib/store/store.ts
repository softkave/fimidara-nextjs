import { configureStore, combineReducers } from "@reduxjs/toolkit";
import keyValueReducer from "./key-value/reducer";
import sessionReducer from "./session/reducer";

const reducer = combineReducers({
  session: sessionReducer,
  keyValue: keyValueReducer,
});

const store = configureStore({
  reducer,
});

export default store;
