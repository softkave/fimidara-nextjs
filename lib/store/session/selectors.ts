import { IAppState } from "../types";

function getUserToken(state: IAppState) {
  return state.session.token;
}

function isUserSignedIn(state: IAppState) {
  return !!state.session.token && !!state.session.userId;
}

function assertUserSignedIn(state: IAppState) {
  if (!isUserSignedIn(state)) {
    // TODO: central error messages location
    throw new Error("User is not signed in.");
  }
}

function assertGetToken(state: IAppState) {
  assertUserSignedIn(state);
  return getUserToken(state)!;
}

function getSessionType(state: IAppState) {
  return state.session.sessionType;
}

function getSessionData(state: IAppState) {
  return state.session;
}

export default class SessionSelectors {
  public static getUserToken = getUserToken;
  public static isUserSignedIn = isUserSignedIn;
  public static getSessionType = getSessionType;
  public static assertGetToken = assertGetToken;
  public static getSessionData = getSessionData;
}
