import { IAppState } from "../types";

function getUserToken(state: IAppState) {
  return state.session.token;
}

function getUserFimidaraAgentToken(state: IAppState) {
  return state.session.agentToken;
}

function isUserSignedIn(state: IAppState) {
  return !!state.session.token && !!state.session.userId;
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

export default class SessionSelectors {
  static getUserToken = getUserToken;
  static getUserFimidaraAgentToken = getUserFimidaraAgentToken;
  static isUserSignedIn = isUserSignedIn;
  static getSessionType = getSessionType;
  static getSessionData = getSessionData;
  static getUserId = getUserId;
}
