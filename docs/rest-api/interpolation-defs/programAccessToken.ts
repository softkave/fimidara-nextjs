import {
  IAssignedPermissionGroup,
  IPermissionGroupInput,
} from './permissionGroups';
import {IAgent} from './system';
import {IEndpointParamsBase, IEndpointResultBase} from './types';

/** @category Program access token */
export interface IProgramAccessToken {
  resourceId: string;

  /** Unique resource name, not case sensitive. Meaning, 'MyResourceName' will
   * match 'myresourcename'. */
  name: string;
  description?: string;
  createdAt: string;
  createdBy: IAgent;
  workspaceId: string;

  /** Permission groups assigned to the token. */
  permissionGroups: IAssignedPermissionGroup[];
  lastUpdatedAt?: string;
  lastUpdatedBy?: IAgent;

  /** JWT token string. */
  tokenStr: string;
}

/** @category Program access token */
export interface INewProgramAccessTokenInput {
  /** Unique resource name, not case sensitive. Meaning, 'MyResourceName' will
   * match 'myresourcename'. */
  name: string;
  description?: string;

  /** Permission groups to assign to the token. When updating a token's
   * permission groups, it will replace existing groups, meaning if you want to
   * add a new permission group, you should include the existing groups and the
   * new one. Also, if you want to remove a permission group, pass the existing
   * permission groups without the group you want to remove. */
  permissionGroups?: IPermissionGroupInput[];
}

/** @category Program access token */
export type IUpdateProgramAccessTokenInput =
  Partial<INewProgramAccessTokenInput>;

/** @category Program access token */
export interface IAddProgramAccessTokenEndpointParams
  extends IEndpointParamsBase {
  token: INewProgramAccessTokenInput;
}

/** @category Program access token */
export interface IAddProgramAccessTokenEndpointResult
  extends IEndpointResultBase {
  token: IProgramAccessToken;
}

/** @category Program access token */
export interface IDeleteProgramAccessTokenEndpointParams
  extends IEndpointParamsBase {
  tokenId?: string;
}

/** @category Program access token */
export type IGetWorkspaceProgramAccessTokenEndpointParams = IEndpointParamsBase;

/** @category Program access token */
export interface IGetWorkspaceProgramAccessTokenEndpointResult
  extends IEndpointResultBase {
  tokens: IProgramAccessToken[];
}

/** @category Program access token */
export interface IGetProgramAccessTokenEndpointParams
  extends IEndpointParamsBase {
  tokenId: string;
}

/** @category Program access token */
export interface IGetProgramAccessTokenEndpointResult
  extends IEndpointResultBase {
  token: IProgramAccessToken;
}

/** @category Program access token */
export interface IUpdateProgramAccessTokenEndpointParams
  extends IEndpointParamsBase {
  tokenId?: string;
  token: IUpdateProgramAccessTokenInput;
}

/** @category Program access token */
export interface IUpdateProgramAccessTokenEndpointResult
  extends IEndpointResultBase {
  token: IProgramAccessToken;
}

/** @category Program access token */
export interface IProgramAccessTokenEndpoints {
  addToken(
    props: IAddProgramAccessTokenEndpointParams
  ): Promise<IAddProgramAccessTokenEndpointResult>;
  getWorkspaceTokens(
    props: IGetWorkspaceProgramAccessTokenEndpointParams
  ): Promise<IGetWorkspaceProgramAccessTokenEndpointResult>;
  getToken(
    props: IGetProgramAccessTokenEndpointParams
  ): Promise<IGetProgramAccessTokenEndpointResult>;
  deleteToken(
    props: IDeleteProgramAccessTokenEndpointParams
  ): Promise<IEndpointResultBase>;
  updateToken(
    props: IUpdateProgramAccessTokenEndpointParams
  ): Promise<IUpdateProgramAccessTokenEndpointResult>;
}
