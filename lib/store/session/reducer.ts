import { createReducer } from "@reduxjs/toolkit";
import { mergeData } from "../../utilities/utils";
import SessionActions from "./actions";
import { ISessionState, SessionType } from "./types";

const sessionReducer = createReducer<ISessionState>(
  { sessionType: SessionType.Uninitialized },
  (builder) => {
    builder.addCase(SessionActions.loginUser, (state, action) => {
      state.sessionType = SessionType.App;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
    });

    builder.addCase(SessionActions.setSessionToWeb, (state) => {
      return { sessionType: SessionType.Web };
    });

    builder.addCase(SessionActions.logoutUser, (state) => {
      return { sessionType: SessionType.Web };
    });

    builder.addCase(SessionActions.update, (state, action) => {
      return mergeData(state, action.payload.data, action.payload.meta);
    });
  }
);

export default sessionReducer;
