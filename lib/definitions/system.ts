import { defaultTo } from "lodash";
import { getClientAddr } from "../api/addr";

export const systemConstants = {
  maxNameLength: 150,
  maxDescriptionLength: 500,
  domainName: getClientAddr(),
  appShortName: "files",
  tokenQueryKey: "t",
  phoneQueryKey: "p",
  organizationId: defaultTo(
    process.env.ORGANIZATION_ID,
    "6LQ03cw7W06m_1bcARMb3"
  ),
  userImagesFolder: defaultTo(
    process.env.USER_IMAGES_FOLDER,
    "/files/images/users"
  ),
  orgImagesFolder: defaultTo(
    process.env.ORG_IMAGES_FOLDER,
    "/files/images/orgs"
  ),
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
  createOrgForm: appRootPaths.app + "/orgs/form",
  org: (orgId: string) => appRootPaths.app + `/orgs/${orgId}`,
  editOrgForm(orgId: string) {
    return `${this.org(orgId)}/form`;
  },
  files(orgId: string) {
    return `${this.org(orgId)}/files`;
  },
  collaborators(orgId: string) {
    return `${this.org(orgId)}/collaborators`;
  },
  requests(orgId: string) {
    return `${this.org(orgId)}/requests`;
  },
  programTokens(orgId: string) {
    return `${this.org(orgId)}/program-tokens`;
  },
  clientTokens(orgId: string) {
    return `${this.org(orgId)}/client-tokens`;
  },
  permissionGroups(orgId: string) {
    return `${this.org(orgId)}/permission-groups`;
  },
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
  settings: appRootPaths.app + "/user/settings",
};

export const appRequestsPaths = {
  requests: appRootPaths.app + "/requests",
};
