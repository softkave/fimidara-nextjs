import {
  IAssignedPermissionGroup,
  IPermissionGroupInput,
} from './permissionGroups';
import {IEndpointParamsBase, IEndpointResultBase} from './types';

/** @category Collaborator */
export interface IUserWorkspace {
  workspaceId: string;
  joinedAt: string;

  /** Permission groups assigned to the user. */
  permissionGroups: IAssignedPermissionGroup[];
}

/** @category Collaborator */
export interface ICollaborator extends IUserWorkspace {
  resourceId: string;
  firstName: string;
  lastName: string;
  email: string;
}

/** @category Collaborator */
export interface IGetCollaboratorEndpointParams extends IEndpointParamsBase {
  collaboratorId: string;
}

/** @category Collaborator */
export interface IGetCollaboratorEndpointResult extends IEndpointResultBase {
  collaborator: ICollaborator;
}

/** @category Collaborator */
export type IGetWorkspaceCollaboratorsEndpointParams = IEndpointParamsBase;

/** @category Collaborator */
export interface IGetWorkspaceCollaboratorsEndpointResult
  extends IEndpointResultBase {
  collaborators: ICollaborator[];
}

/** @category Collaborator */
export interface IRemoveCollaboratorEndpointParams extends IEndpointParamsBase {
  collaboratorId: string;
}

/** @category Collaborator */
export interface IUpdateCollaboratorPermissionGroupsEndpointParams
  extends IEndpointParamsBase {
  collaboratorId: string;

  /** Permission groups to assign to the user. When updating a user's permission
   * groups, it will replace existing groups, meaning if you want to add a new
   * permission group, you should include the existing groups and the new one.
   * Also, if you want to remove a permission group, pass the existing
   * permission groups without the group you want to remove. */
  permissionGroups: IPermissionGroupInput[];
}

/** @category Collaborator */
export interface IUpdateCollaboratorPermissionGroupsEndpointResult
  extends IEndpointResultBase {
  collaborator: ICollaborator;
}

/** @category Collaborator */
export interface ICollaboratorEndpoints {
  removeCollaborator(
    props: IRemoveCollaboratorEndpointParams
  ): Promise<IEndpointResultBase>;
  getWorkspaceCollaborators(
    props: IGetWorkspaceCollaboratorsEndpointParams
  ): Promise<IGetWorkspaceCollaboratorsEndpointResult>;
  getCollaborator(
    props: IGetCollaboratorEndpointParams
  ): Promise<IGetCollaboratorEndpointResult>;
  updateCollaboratorPermissionGroups(
    props: IUpdateCollaboratorPermissionGroupsEndpointParams
  ): Promise<IUpdateCollaboratorPermissionGroupsEndpointResult>;
}
