import { createAction } from "@reduxjs/toolkit";
import { IMergeDataMeta } from "../../utilities/utils";
import { ISessionState } from "./types";

const loginUser = createAction<{
  token: string;
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
  public static loginUser = loginUser;
  public static logoutUser = logoutUser;
  public static setSessionToWeb = setSessionToWeb;
  public static update = update;
}
