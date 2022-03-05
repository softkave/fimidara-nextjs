export enum SessionType {
  Initializing = "Initializing",
  Web = "Web",
  App = "App",
  Uninitialized = "Uninitialized",
}

export interface ISessionState {
  sessionType: SessionType;
  token?: string;
  clientAssignedToken?: string;
  userId?: string;
}
