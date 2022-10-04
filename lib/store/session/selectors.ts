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
    throw new Error("Please sign in");
  }
}

function assertGetToken(state: IAppState) {
  assertUserSignedIn(state);
  return getUserToken(state)!;
}

function assertGetClientAssignedToken(state: IAppState) {
  assertUserSignedIn(state);
  return state.session.clientAssignedToken;
}

function getSessionType(state: IAppState) {
  return state.session.sessionType;
}

function getSessionData(state: IAppState) {
  return state.session;
}

function getUserId(state: IAppState) {
  return state.session.userId;
}

function assertGetUserId(state: IAppState) {
  const userId = getUserId(state);

  if (!userId) {
    throw new Error("Please sign in");
  }

  return userId;
}

export default class SessionSelectors {
  static getUserToken = getUserToken;
  static isUserSignedIn = isUserSignedIn;
  static getSessionType = getSessionType;
  static assertGetToken = assertGetToken;
  static getSessionData = getSessionData;
  static getUserId = getUserId;
  static assertGetUserId = assertGetUserId;
  static assertGetClientAssignedToken = assertGetClientAssignedToken;
}
