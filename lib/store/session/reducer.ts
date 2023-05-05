import { createReducer } from "@reduxjs/toolkit";
import { mergeData } from "../../utils/utils";
import SessionActions from "./actions";
import { ISessionState, SessionType } from "./types";

const sessionReducer = createReducer<ISessionState>(
  { sessionType: SessionType.Uninitialized },
  (builder) => {
    builder.addCase(SessionActions.loginUser, (state, action) => {
      state.sessionType = SessionType.App;
      state.token = action.payload.userToken;
      state.userId = action.payload.userId;
      state.agentToken = action.payload.clientAssignedToken;
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
