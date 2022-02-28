import { createReducer } from "@reduxjs/toolkit";
import SessionActions from "../session/actions";
import KeyValueActions from "./actions";
import { IKeyValueState, KeyValueKeys } from "./types";

const defaultState: IKeyValueState = {};

const keyValueReducer = createReducer<IKeyValueState>(
  {
    ...defaultState,
  },
  (builder) => {
    builder.addCase(KeyValueActions.setKey, (state, action) => {
      const key = action.payload.key;
      const value = action.payload.value;
      state[key] = value;
    });

    builder.addCase(KeyValueActions.setValues, (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        const value = action.payload[key as KeyValueKeys];
        state[key as KeyValueKeys] = value;
      });
    });

    builder.addCase(KeyValueActions.deleteKey, (state, action) => {
      const key = action.payload;
      delete state[key];
    });

    builder.addCase(SessionActions.logoutUser, () => {
      return {};
    });

    builder.addCase(SessionActions.loginUser, (state) => {
      Object.keys(defaultState).forEach((key) => {
        state[key as KeyValueKeys] = defaultState[key as KeyValueKeys];
      });
    });
  }
);

export default keyValueReducer;
