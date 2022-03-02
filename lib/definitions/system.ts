import { getClientAddr } from "../api/addr";

export const systemConstants = {
  maxNameLength: 150,
  maxDescriptionLength: 500,
  domainName: getClientAddr(),
  appShortName: "files",
  tokenQueryKey: "t",
  phoneQueryKey: "p",
  organizationId: "files-by-softkave",
  userImagesFolder:
    process.env.NODE_ENV === "development"
      ? "/files-dev/images/user"
      : "/files/images/user",
};

export interface ISelectedIdRouteMatch {
  selected?: string;
}

export function getSelectedItemPath(path: string) {
  return `${path}/:selected`;
}

export enum SessionAgentType {
  User = "user",
  ProgramAccessToken = "program-access-token",
  ClientAssignedToken = "client-assigned-token",
}

export interface IAgent {
  agentId: string;
  agentType: SessionAgentType;
}

export enum AppResourceType {
  Organization = "organization",
  CollaborationRequest = "collaboration-request",
  ProgramAccessToken = "program-access-token",
  ClientAssignedToken = "client-assigned-token",
  UserToken = "user-token",
  PresetPermissionsGroup = "preset-permissions-group",
  PermissionItem = "permission-item",
  Folder = "folder",
  File = "file",
  User = "user",
}

export enum BasicCRUDActions {
  All = "*",
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
}

export interface IAppError extends Error {
  field?: string;
  action?: string;
  value?: any;
}

export const appRootPaths = {
  home: "/",
  app: "/app",
  account: "/account",
};

export const appOrgPaths = {
  orgs: appRootPaths.app + "/orgs",
};

export const appAccountPaths = {
  signup: appRootPaths.account + "/signup",
  login: appRootPaths.account + "/login",
  verifyEmail: appRootPaths.account + "/verify-email",
  forgotPassword: appRootPaths.account + "/forgot-password",
  changePassword: appRootPaths.account + "/change-password",
  settings: appRootPaths.account + "/settings",
};

export const appUserPaths = {
  settings: appRootPaths.app + "/settings",
};

export const appRequestsPaths = {
  requests: appRootPaths.app + "/requests",
};
