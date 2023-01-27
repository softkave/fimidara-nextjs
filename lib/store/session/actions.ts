import { createAction } from "@reduxjs/toolkit";
import { IMergeDataMeta } from "../../utils/utils";
import { ISessionState } from "./types";

const loginUser = createAction<{
  userToken: string;
  clientAssignedToken: string;
  userId: string;
  isDemo?: boolean;
}>("session/loginUser");

const setSessionToWeb = createAction("session/setSessionToWeb");
const logoutUser = createAction("session/logoutUser");
const update = createAction<{
  data: Partial<ISessionState>;
  meta?: IMergeDataMeta;
}>("session/update");

export default class SessionActions {
  static loginUser = loginUser;
  static logoutUser = logoutUser;
  static setSessionToWeb = setSessionToWeb;
  static update = update;
}
