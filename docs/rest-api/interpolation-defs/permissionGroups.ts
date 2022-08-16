import {IAgent} from './system';
import {IEndpointParamsBase, IEndpointResultBase} from './types';

/** @category Permission group */
export interface IAssignedPermissionGroup {
  permissionGroupId: string;
  assignedAt: string;
  assignedBy: IAgent;

  /** Determines the weight of the permission group when evaluating permission
   * items. Lower values will override permission groups with higher values. */
  order: number;
}

/** @category Permission group */
export interface IPermissionGroup {
  resourceId: string;
  workspaceId: string;
  createdAt: string;
  createdBy: IAgent;
  lastUpdatedAt?: string;
  lastUpdatedBy?: IAgent;

  /** Unique resource name, not case sensitive. Meaning, 'MyResourceName' will
   * match 'myresourcename'. */
  name: string;
  description?: string;

  /** Permission groups assigned to this group. It allows you to compose
   * permission groups so that a group can inherit the permissions of other
   * groups. */
  permissionGroups: IAssignedPermissionGroup[];
}

/** @category Permission group */
export interface IPermissionGroupInput {
  permissionGroupId: string;

  /** Determines the weight of the permission group when evaluating permission
   * items. Lower values will override permission groups with higher values. */
  order: number;
}

/** @category Permission group */
export interface INewPermissionGroupInput {
  /** Unique resource name, not case sensitive. Meaning, 'MyResourceName' will
   * match 'myresourcename'. */
  name: string;
  description?: string;

  /** Existing permission groups to assign to this group. When updating a
   * group's assigned permission groups, it will replace existing groups,
   * meaning if you want to add a new permission group, you should include the
   * existing groups and the new one. Also, if you want to remove a permission
   * group, pass the existing permission groups without the group you want to
   * remove. */
  permissionGroups?: IPermissionGroupInput[];
}

/** @category Permission group */
export type IUpdatePermissionGroupInput = Partial<INewPermissionGroupInput>;

/** @category Permission group */
export interface IAddPermissionGroupEndpointParams extends IEndpointParamsBase {
  permissionGroup: INewPermissionGroupInput;
}

/** @category Permission group */
export interface IAddPermissionGroupEndpointResult extends IEndpointResultBase {
  permissionGroup: IPermissionGroup;
}

/** @category Permission group */
export interface IDeletePermissionGroupEndpointParams
  extends IEndpointParamsBase {
  permissionGroupId: string;
}

/** @category Permission group */
export type IGetWorkspacePermissionGroupEndpointParams = IEndpointParamsBase;

/** @category Permission group */
export interface IGetWorkspacePermissionGroupEndpointResult
  extends IEndpointResultBase {
  permissionGroups: IPermissionGroup[];
}

/** @category Permission group */
export interface IGetPermissionGroupEndpointParams extends IEndpointParamsBase {
  permissionGroupId: string;
}

/** @category Permission group */
export interface IGetPermissionGroupEndpointResult extends IEndpointResultBase {
  permissionGroup: IPermissionGroup;
}

/** @category Permission group */
export interface IUpdatePermissionGroupEndpointParams
  extends IEndpointParamsBase {
  permissionGroupId: string;
  permissionGroup: IUpdatePermissionGroupInput;
}

/** @category Permission group */
export interface IUpdatePermissionGroupEndpointResult
  extends IEndpointResultBase {
  permissionGroup: IPermissionGroup;
}

/** @category Permission group */
export interface IPermissionGroupEndpoints {
  addPermissionGroup(
    props: IAddPermissionGroupEndpointParams
  ): Promise<IAddPermissionGroupEndpointResult>;
  getWorkspacePermissionGroups(
    props: IGetWorkspacePermissionGroupEndpointParams
  ): Promise<IGetWorkspacePermissionGroupEndpointResult>;
  getPermissionGroup(
    props: IGetPermissionGroupEndpointParams
  ): Promise<IGetPermissionGroupEndpointResult>;
  deletePermissionGroup(
    props: IDeletePermissionGroupEndpointParams
  ): Promise<IEndpointResultBase>;
  updatePermissionGroup(
    props: IUpdatePermissionGroupEndpointParams
  ): Promise<IUpdatePermissionGroupEndpointResult>;
}
