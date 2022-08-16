import {
  IAssignedPermissionGroup,
  IPermissionGroupInput,
} from './permissionGroups';
import {IAgent} from './system';
import {IEndpointParamsBase, IEndpointResultBase} from './types';

/** @category Client assigned token */
export interface IClientAssignedToken {
  resourceId: string;

  /** Unique resource name, not case sensitive. Meaning, 'MyResourceName' will
   * match 'myresourcename'. */
  name?: string;

  /** Optional ID provided for easy retrieval and reuse of client tokens.
   * Example can be a user ID. */
  providedResourceId?: string;
  createdAt: string;
  createdBy: IAgent;
  lastUpdatedBy?: IAgent;
  lastUpdatedAt?: string;
  workspaceId: string;
  version: number;

  /** Permission groups assigned to the token. */
  permissionGroups: IAssignedPermissionGroup[];

  /** @todo make the type of `issuedAt` and `expires` consistent. */
  issuedAt: string;
  expires?: number;

  /** JWT token string. */
  tokenStr: string;
}

/** @category Client assigned token */
export interface INewClientAssignedTokenInput {
  /** Optional ID provided for easy retrieval and reuse of client tokens.
   * Example can be a user ID. */
  providedResourceId?: string;

  /** Unique resource name, not case sensitive. Meaning, 'MyResourceName' will
   * match 'myresourcename'. */
  name?: string;
  description?: string;
  expires?: string;

  /** Permission groups to assign to the token. When updating a token's
   * permission groups, it will replace existing groups, meaning if you want to
   * add a new permission group, you should include the existing groups and the
   * new one. Also, if you want to remove a permission group, pass the existing
   * permission groups without the group you want to remove. */
  permissionGroups: IPermissionGroupInput[];
}

/** @category Client assigned token */
export interface IAddClientAssignedTokenEndpointParams
  extends IEndpointParamsBase {
  token: INewClientAssignedTokenInput;
}

/** @category Client assigned token */
export interface IAddClientAssignedTokenEndpointResult
  extends IEndpointResultBase {
  token: IClientAssignedToken;
}

/** @category Client assigned token */
export interface IDeleteClientAssignedTokenEndpointParams
  extends IEndpointParamsBase {
  tokenId?: string;
}

/** @category Client assigned token */
export type IGetWorkspaceClientAssignedTokensEndpointParams =
  IEndpointParamsBase;

/** @category Client assigned token */
export interface IGetWorkspaceClientAssignedTokensEndpointResult
  extends IEndpointResultBase {
  tokens: IClientAssignedToken[];
}

/** @category Client assigned token */
export interface IGetClientAssignedTokenEndpointParams
  extends IEndpointParamsBase {
  tokenId?: string;
}

/** @category Client assigned token */
export interface IGetClientAssignedTokenEndpointResult
  extends IEndpointResultBase {
  token: IClientAssignedToken;
}

/** @category Client assigned token */
export interface IUpdateClientAssignedTokenEndpointParams
  extends IEndpointParamsBase {
  tokenId?: string;
  token: Partial<INewClientAssignedTokenInput>;
}

/** @category Client assigned token */
export interface IUpdateClientAssignedTokenEndpointResult
  extends IEndpointResultBase {
  token: IClientAssignedToken;
}

/** @category Client assigned token */
export interface IClientAssignedTokenEndpoints {
  addToken(
    props: IUpdateClientAssignedTokenEndpointParams
  ): Promise<IAddClientAssignedTokenEndpointResult>;
  getWorkspaceTokens(
    props: IGetWorkspaceClientAssignedTokensEndpointParams
  ): Promise<IGetWorkspaceClientAssignedTokensEndpointResult>;
  getToken(
    props: IGetClientAssignedTokenEndpointParams
  ): Promise<IGetClientAssignedTokenEndpointResult>;
  deleteToken(
    props: IDeleteClientAssignedTokenEndpointParams
  ): Promise<IEndpointResultBase>;
  updateToken(
    props: IUpdateClientAssignedTokenEndpointParams
  ): Promise<IUpdateClientAssignedTokenEndpointResult>;
}
